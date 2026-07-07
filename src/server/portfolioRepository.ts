import { promises as fs } from 'fs';
import path from 'path';
import { wait } from '@/lib/delay';
import type { RawPortfolioData } from '@/types/portfolio';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio-data.json');
const SIMULATED_IO_DELAY_MS = 250;

/**
 * PortfolioRepository
 * --------------------
 * The lowest-level data-access layer, and the *only* file in this
 * codebase that knows portfolio-data.json exists. There is no real
 * database in this assessment, so this reads a local JSON file that
 * stands in for one. Swapping this file's internals for a real ORM
 * call, a REST call to a core-banking service, etc. would not require
 * any change to PortfolioService or anything above it - that
 * isolation is the entire point of a repository layer.
 */
export async function fetchRawPortfolioData(): Promise<RawPortfolioData> {
  await wait(SIMULATED_IO_DELAY_MS);
  const contents = await fs.readFile(DATA_FILE_PATH, 'utf-8');
  return JSON.parse(contents) as RawPortfolioData;
}
