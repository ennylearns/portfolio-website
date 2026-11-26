import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';

const ROOT_DIR = resolve(import.meta.dirname, '..', '..');
const DIST_DIR = resolve(ROOT_DIR, 'dist');

export function buildSite(): void {
  execSync('pnpm build', {
    cwd: ROOT_DIR,
    stdio: 'pipe',
    encoding: 'utf-8',
  });
}

export function readHtml(relativePath: string): HTMLElement {
  const fullPath = resolve(DIST_DIR, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Built HTML file not found: ${fullPath}`);
  }
  const html = readFileSync(fullPath, 'utf-8');
  return parse(html);
}

export function readDistFile(relativePath: string): string {
  const fullPath = resolve(DIST_DIR, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Built file not found: ${fullPath}`);
  }
  return readFileSync(fullPath, 'utf-8');
}
