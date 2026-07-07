import { cn } from '@/lib/cn';

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
            value === option
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-card text-ink-neutral hover:bg-surfaceMuted'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
