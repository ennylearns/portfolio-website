import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';
import { expect } from 'vitest';

const ROOT_DIR = resolve(import.meta.dirname, '..', '..');
const DIST_DIR = resolve(ROOT_DIR, 'dist');

export interface SiteReader {
  distDir: string;
  readHtml: (relativePath: string) => HTMLElement;
  readDistFile: (relativePath: string) => string;
  distExists: (relativePath: string) => boolean;
}

function createSiteReader(distDir: string): SiteReader {
  return {
    distDir,
    readHtml(relativePath: string): HTMLElement {
      const fullPath = resolve(distDir, relativePath);
      if (!existsSync(fullPath)) {
        throw new Error(`Built HTML file not found: ${fullPath}`);
      }
      return parse(readFileSync(fullPath, 'utf-8'));
    },
    readDistFile(relativePath: string): string {
      const fullPath = resolve(distDir, relativePath);
      if (!existsSync(fullPath)) {
        throw new Error(`Built file not found: ${fullPath}`);
      }
      return readFileSync(fullPath, 'utf-8');
    },
    distExists(relativePath: string): boolean {
      return existsSync(resolve(distDir, relativePath));
    },
  };
}

const workspaceReader = createSiteReader(DIST_DIR);

export function buildSite(): void {
  execSync('pnpm build', {
    cwd: ROOT_DIR,
    stdio: 'pipe',
    encoding: 'utf-8',
  });
}

export const readHtml = workspaceReader.readHtml;
export const readDistFile = workspaceReader.readDistFile;
export const distExists = workspaceReader.distExists;

export interface TempSite extends SiteReader {
  rootDir: string;
  writeContent: (relativeContentPath: string, content: string) => void;
  build: () => void;
  cleanup: () => void;
}

/** Creates an isolated temporary copy of the Astro project under os.tmpdir(). */
export function createTempSite(prefix = 'astro-site-test-'): TempSite {
  const tempRoot = mkdtempSync(resolve(tmpdir(), prefix));

  cpSync(resolve(ROOT_DIR, 'src'), resolve(tempRoot, 'src'), {
    recursive: true,
  });
  cpSync(resolve(ROOT_DIR, 'public'), resolve(tempRoot, 'public'), {
    recursive: true,
  });
  for (const configFile of ['astro.config.mjs', 'tsconfig.json', 'package.json']) {
    cpSync(resolve(ROOT_DIR, configFile), resolve(tempRoot, configFile));
  }
  symlinkSync(
    resolve(ROOT_DIR, 'node_modules'),
    resolve(tempRoot, 'node_modules'),
    'junction',
  );

  const reader = createSiteReader(resolve(tempRoot, 'dist'));

  return {
    ...reader,
    rootDir: tempRoot,
    writeContent(relativeContentPath: string, content: string): void {
      const fullPath = resolve(tempRoot, 'src/content', relativeContentPath);
      mkdirSync(dirname(fullPath), { recursive: true });
      writeFileSync(fullPath, content, 'utf-8');
    },
    build(): void {
      execSync('pnpm build', {
        cwd: tempRoot,
        stdio: 'pipe',
        encoding: 'utf-8',
      });
    },
    cleanup(): void {
      rmSync(tempRoot, { recursive: true, force: true });
    },
  };
}

export interface SeoMetadataOptions {
  canonical: string;
  ogType?: 'website' | 'article';
  titleContains?: string[];
  description?: string;
  descriptionContains?: string[];
}

export function expectSeoMetadata(
  root: HTMLElement,
  opts: SeoMetadataOptions,
): void {
  const title = root.querySelector('title')?.textContent.trim();
  expect(title).toBeTruthy();
  for (const fragment of opts.titleContains ?? []) {
    expect(title).toContain(fragment);
  }

  const metaDesc = root
    .querySelector('meta[name="description"]')
    ?.getAttribute('content');
  expect(metaDesc).toBeTruthy();
  if (opts.description !== undefined) {
    expect(metaDesc).toBe(opts.description);
  }
  for (const fragment of opts.descriptionContains ?? []) {
    expect(metaDesc).toContain(fragment);
  }

  const canonical = root
    .querySelector('link[rel="canonical"]')
    ?.getAttribute('href');
  expect(canonical).toBe(opts.canonical);

  expect(
    root.querySelector('meta[property="og:title"]')?.getAttribute('content'),
  ).toBe(title);
  expect(
    root
      .querySelector('meta[property="og:description"]')
      ?.getAttribute('content'),
  ).toBe(metaDesc);
  expect(
    root.querySelector('meta[property="og:type"]')?.getAttribute('content'),
  ).toBe(opts.ogType ?? 'website');
  expect(
    root.querySelector('meta[property="og:url"]')?.getAttribute('content'),
  ).toBe(opts.canonical);

  expect(
    root.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
  ).toBe('summary');
  expect(
    root.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
  ).toBe(title);
  expect(
    root
      .querySelector('meta[name="twitter:description"]')
      ?.getAttribute('content'),
  ).toBe(metaDesc);
}
