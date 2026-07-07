# Trove — Investment Portfolio Dashboard

A frontend engineering assessment submission: a React (Next.js 14, App Router) investment
dashboard with a simulated login flow and a single dashboard view covering net worth,
sector allocation, account breakdowns, holdings, and transactions.

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). There's no real backend or
credential store (per the brief), so **any syntactically valid email + any non-empty
password** signs you in — e.g. `you@example.com` / `anything`.

```bash
npm run build && npm run start   # production build
```

## Deploying

Standard Next.js 14 App Router project — deploys to **Vercel** with zero configuration:
push this to a GitHub repo, import it in Vercel, done. Netlify works too via their
Next.js runtime.

A git repo has already been initialized in this folder with one commit, using a
placeholder author identity. Before pushing, either update it or just re-commit as
yourself:

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
git commit --amend --reset-author --no-edit
git remote add origin <your-empty-repo-url>
git push -u origin main
```

## Architecture

Two layers, matching the server/client split the assessment asks for:

```
Server (mock backend)
data/portfolio-data.json → PortfolioRepository → PortfolioService → /api/portfolio (route)
                                                                   → /api/auth/login (route)

Client
LoginForm → AuthContext → (redirect) → dashboard/layout guard → DashboardProvider
                                                                → DashboardContext
                                                                → presentation components
```

- **`src/server/portfolioRepository.ts`** is the only file that touches the JSON file.
  If this became a real product, this is the file you'd rewrite to call a database or a
  core-banking microservice — nothing above it would need to change.
- **`src/server/portfolioService.ts`** turns raw records into what the UI needs (net
  worth, per-holding gain/loss, sector allocation, account groupings), by calling pure,
  independently-testable functions in **`src/lib/calculations/portfolioCalculations.ts`**.
  Every data-quirk decision below lives in that one file.
- **`src/app/api/portfolio/route.ts`** and **`src/app/api/auth/login/route.ts`** are the
  only public server surface. Components never import the JSON or call the
  repository/service directly.
- **`src/services/portfolioService.ts`** (client) is the "service layer" the brief asks
  for — it wraps `fetch('/api/portfolio')` and is the only thing `DashboardContext`
  talks to.
- **`src/context/AuthContext.tsx`** owns sign-in state and talks to the server only
  through `src/services/authService.ts`.
- **`src/context/DashboardContext.tsx`** fetches portfolio data and exposes
  `{ data, isLoading, error, refetch }`. Every dashboard component is a plain consumer
  of this context — none of them fetch data themselves.
- **`src/app/dashboard/layout.tsx`** is the route guard: unauthenticated visitors are
  redirected to `/login`; `DashboardProvider` only mounts once `AuthContext` confirms a
  session.

## Data quirks — what I decided, and why

1. **NVDA, `currentPrice: 0`.** Treated as "price feed unavailable," not "worth $0."
   NVDA still appears in the Stocks list (you do hold 5 shares) with a "Price
   unavailable" label instead of a value or gain/loss, but it's excluded from net worth,
   allocation, and cost-basis totals — including it at $0 would understate the
   portfolio; including it at cost would overstate confidence in a number we don't
   actually have. The net worth card shows a small "1 holding excluded — price
   unavailable" footnote so this isn't a silent omission. Its position still counts
   toward its sector's position count on the account cards, just not toward the dollar
   total.
2. **DIS, `shares: 0`.** Treated as a closed position, not an active holding: filtered
   out of the holdings list, allocation, and account cards. Its dollar value is $0
   regardless of price, but showing a zero-share row in an "active portfolio" view is
   misleading — you don't hold Disney anymore. A "closed positions" history view would
   be the natural next feature.
3. **`PENDING` transactions.** Distinct amber badge. Trove's v3 palette doesn't define a
   dedicated warning/pending color, so I repurposed the "Cream" chart-segment token for
   this — the closest visual match to the wireframe's amber pill. Flagging this as
   something I'd confirm with design in a real project rather than quietly inventing a
   new brand color.
4. **`FAILED` transactions.** Red badge, and — unlike completed/pending rows — the
   dollar amount renders in muted gray rather than green/red. A failed order never
   actually moved money, so coloring it like a real gain or loss would misrepresent what
   happened.
5. **Negative gain/loss formatting.** Explicit `+`/`-` sign, red for losses, green for
   gains, via `Intl.NumberFormat` so multi-currency support is a non-issue later.
6. **Bonus quirk I noticed:** the JSON's top-level `summary.totalPortfolioValue`
   (**$48,250.75**) doesn't reconcile with what the `holdings` array actually adds up to
   (**~$19,134**, and that's *before* excluding NVDA/DIS). The brief's explicit ask for
   net worth "computed from all holdings" is presumably exactly why — trusting a
   pre-aggregated summary field would have silently shown a materially wrong number. Net
   worth is computed live from `holdings` everywhere in this app; the JSON's `summary`
   object is never read for display.

## On the security requirements in your message

A couple of the asks in your architecture notes don't map cleanly onto what's actually
being built here, and it seemed more useful to say that directly than to quietly build
something that looks secure but isn't:

- **"Encrypt data in transit and at rest between client and server."** There's no
  database in this project — `data/portfolio-data.json` is a static mock file, not a
  store of real user data, so "at rest" encryption doesn't really apply. "In transit" is
  handled by HTTPS/TLS once this is deployed to Vercel/Netlify, which is a hosting-layer
  property, not something to hand-roll in application code. A client-side JS
  "encryption" layer for a password being POSTed to a same-origin, unauthenticated mock
  endpoint would need its key to live in the browser bundle — which means it wouldn't
  protect anything, just add encoding dressed up to look like security. I didn't build
  that. What I did do, which is the real, applicable version of "handle credentials
  carefully": the password is never persisted anywhere (not `sessionStorage`, not
  logged), and it's cleared from React state the moment sign-in resolves either way.
- **"Email regex to prevent CSRF/XSS/injection."** Validating email format
  (`src/lib/validation/emailValidator.ts`) is good for data quality and UX, but it isn't
  a CSRF or XSS control — those need different mechanisms (CSRF: SameSite cookies/tokens
  on state-changing requests, moot here since this mock login never sets a session
  cookie; XSS: output encoding, which React does automatically as long as
  `dangerouslySetInnerHTML` is never used, which it isn't anywhere in this codebase). I
  built the email validator because it's genuinely useful for form UX, and separately
  built `src/lib/validation/sanitizeInput.ts`, which strips invisible/control Unicode
  characters (zero-width spaces, bidi overrides, etc.) and whitelists characters
  per-field — that's the real defense-in-depth for the injection concern, I just didn't
  want to file it under the wrong threat model.
- One nuance worth flagging inside that sanitizer: **the password field is not
  character-whitelisted** the way the email/search fields are. Symbols are what make a
  password strong, so stripping `! " # $ % &` etc. would quietly weaken — or silently
  corrupt — a password someone meant to type. The password sanitizer only strips
  genuinely invisible/control characters; everything printable is left alone.

## Other notable decisions

- **Account/category cards** are grouped by `sector` from the actual JSON (Technology,
  Automotive, Healthcare, Finance) rather than the wireframe's `US Portfolio / NG
  Portfolio / Fixed Income / GEMS` labels, which aren't derivable from the provided
  dataset — the brief explicitly asks for this list to be derived from the data, and the
  wireframe is stated to be a loose guide, not a spec.
- **Net worth sparkline** is illustrative, not real history — the JSON has no historical
  time series, so I generated a smooth deterministic curve that always ends at the true,
  computed net worth rather than fabricate fake "history" that isn't in the data.
- **"0.85ms" loading state:** read as a typo for ~850ms (0.85ms is imperceptible to a
  human). Simulated as a real server-side delay in `/api/auth/login`, so the button's
  spinner reflects an actual round trip rather than a fake client-side timer.
- **Dependency versions are deliberately pinned to Next.js 14 / React 18 / Tailwind 3**
  rather than the latest majors available today (Next 16 / React 19 / Tailwind 4, all of
  which changed core conventions recently) — I wanted patterns I could verify compile
  and run correctly rather than risk subtly-wrong config on a brand-new major. `npm
  audit` flagged a critical CVE on the initial `next@14.2.5` install; this now pins
  `14.2.35`, the patched release on the same line, and that vulnerability is resolved.
  The handful of remaining `npm audit` warnings are transitive dev-tooling dependencies
  (inside the ESLint/TypeScript-ESLint chain) that don't ship in the production bundle;
  fully silencing them would mean force-upgrading to Next 16. Upgrading the whole stack
  later is a config-only exercise, not an architecture change.
- **No Google Fonts / `next/font/google`.** I initially wired up Inter via
  `next/font/google`, but that fetches the font at *build time*, and it failed in my
  sandboxed build environment (no network access to `fonts.googleapis.com`). Rather than
  ship something whose build success depends on the reviewer's network, I switched to a
  system font stack (`-apple-system, Segoe UI, Roboto, ...`) — zero external dependency,
  and explicitly one of the three typefaces the brief allows ("Inter, DM Sans, or system
  default — your choice").
- Session persistence uses `sessionStorage` for a non-sensitive `{ name, email }` object
  only, purely so refreshing `/dashboard` doesn't bounce you back to `/login`. No token,
  no password, ever stored.
- `/api/portfolio?simulateError=1` forces a 500 response, useful for demoing the
  error/retry UI without making the deployed app flaky by default. Try it after logging
  in by editing the URL, or by calling `fetchPortfolio({ simulateError: true })` from
  `DashboardContext` temporarily.
- No UI component libraries were used anywhere — all styling is Tailwind utility classes
  against a custom theme (`tailwind.config.ts`) built from the exact Trove v3 palette
  tokens. `Button`, `Card`, `Badge`, etc. under `src/components/ui/` are this project's
  own small components, not a third-party kit.

## What I'd add with more time

- Real historical net-worth data and a functioning 1D/1W/1M/ALL range query
- Unit tests for `portfolioCalculations.ts` — it's pure functions, so this is cheap and
  high-value
- A "closed positions" view for holdings like DIS
- Real password-strength/leaked-credential checks if this ever became a real auth flow
- A persisted, real backend + database, with the repository swapped for a real client —
  the whole point of the current layering is that this swap wouldn't touch anything else

## Project structure

```
data/portfolio-data.json          mock "database"
src/
  app/
    api/portfolio/route.ts        GET  - portfolio data
    api/auth/login/route.ts       POST - simulated login
    login/page.tsx
    dashboard/layout.tsx          route guard + DashboardProvider
    dashboard/page.tsx
    layout.tsx, globals.css, page.tsx
  server/
    portfolioRepository.ts        reads data/portfolio-data.json
    portfolioService.ts           derives summary/allocation/accounts
  services/                       client-side service layer
    portfolioService.ts
    authService.ts
  context/
    AuthContext.tsx
    DashboardContext.tsx
  lib/
    calculations/portfolioCalculations.ts   all the quirk-handling logic
    validation/emailValidator.ts
    validation/sanitizeInput.ts
    format.ts, delay.ts, cn.ts
  components/
    auth/LoginForm.tsx
    layout/Sidebar.tsx, TopBar.tsx
    dashboard/NetWorthCard.tsx, AllocationCard.tsx, AccountList.tsx,
              HoldingsTransactionsTabs.tsx, StocksTab.tsx, OrdersTab.tsx,
              HoldingCard.tsx, TransactionRow.tsx, FilterPills.tsx
    ui/Button.tsx, Card.tsx, Badge.tsx, Feedback.tsx
  types/portfolio.ts
```
