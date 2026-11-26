import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildSite, readHtml } from './helpers/site';

const ROOT_DIR = resolve(import.meta.dirname, '..');

function expectBuildFailureWithPrototype(frontmatter: string): void {
  const tempRoot = mkdtempSync(resolve(tmpdir(), 'astro-invalid-proto-'));
  try {
    cpSync(resolve(ROOT_DIR, 'src'), resolve(tempRoot, 'src'), {
      recursive: true,
    });
    cpSync(resolve(ROOT_DIR, 'public'), resolve(tempRoot, 'public'), {
      recursive: true,
    });
    cpSync(
      resolve(ROOT_DIR, 'astro.config.mjs'),
      resolve(tempRoot, 'astro.config.mjs'),
    );
    cpSync(
      resolve(ROOT_DIR, 'tsconfig.json'),
      resolve(tempRoot, 'tsconfig.json'),
    );
    cpSync(resolve(ROOT_DIR, 'package.json'), resolve(tempRoot, 'package.json'));
    symlinkSync(
      resolve(ROOT_DIR, 'node_modules'),
      resolve(tempRoot, 'node_modules'),
      'junction',
    );

    writeFileSync(
      resolve(tempRoot, 'src/content/prototypes/invalid-prototype.md'),
      frontmatter,
      'utf-8',
    );

    expect(() => {
      execSync('pnpm build', {
        cwd: tempRoot,
        stdio: 'pipe',
        encoding: 'utf-8',
      });
    }).toThrow();
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

describe('Prototypes showcase & AI design slop-remover (built static site)', () => {
  beforeAll(() => {
    buildSite();
  });

  it('renders Prototypes index with published Prototypes ordered by order, scope badge, and link to detail page', () => {
    const doc = readHtml('prototypes/index.html');
    const main = doc.querySelector('main');
    expect(main).not.toBeNull();

    const h1 = main!.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toContain('Prototypes');

    const nav = doc.querySelector('header nav');
    expect(nav).not.toBeNull();
    const prototypesNavLink = nav!
      .querySelectorAll('a')
      .find((a) => a.getAttribute('href') === '/prototypes');
    expect(prototypesNavLink?.getAttribute('aria-current')).toBe('page');

    const mainText = main!.textContent;
    expect(mainText).toContain('AI Design Slop-Remover');
    expect(mainText).toContain('AI Craft');

    const detailLinks = main!
      .querySelectorAll('a')
      .filter((a) => a.getAttribute('href') === '/prototypes/ai-design-slop-remover');
    expect(detailLinks.length).toBeGreaterThanOrEqual(1);

    const title = doc.querySelector('title')?.textContent.trim();
    expect(title).toBeTruthy();
    expect(title).toContain('Prototypes');
    expect(title).toContain('Eniola Odunaiya');

    const metaDesc = doc
      .querySelector('meta[name="description"]')
      ?.getAttribute('content');
    expect(metaDesc).toBeTruthy();

    const canonical = doc
      .querySelector('link[rel="canonical"]')
      ?.getAttribute('href');
    expect(canonical).toBe('https://eniolaodunaiya.com/prototypes/');

    expect(
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ).toBe(title);
    expect(
      doc
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content'),
    ).toBe(metaDesc);
    expect(
      doc.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    ).toBe(canonical);

    expect(
      doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
    ).toBe('summary');

    expect(doc.querySelectorAll('script')).toHaveLength(0);
  });

  it('renders AI Design Slop-Remover Prototype detail page with scope badge, all 4 sections, Before/After SVGs, external links, SEO metadata, bottom Subscriber prompt, and zero scripts', () => {
    const doc = readHtml('prototypes/ai-design-slop-remover/index.html');
    const main = doc.querySelector('main');
    expect(main).not.toBeNull();

    const h1 = main!.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toContain('AI Design Slop-Remover');

    expect(main!.textContent).toContain('AI Craft');

    const nav = doc.querySelector('header nav');
    expect(nav).not.toBeNull();
    const prototypesNavLink = nav!
      .querySelectorAll('a')
      .find((a) => a.getAttribute('href') === '/prototypes');
    expect(prototypesNavLink?.getAttribute('aria-current')).toBe('page');

    const headings = main!
      .querySelectorAll('h2')
      .map((h) => h.textContent.trim());
    expect(headings).toContain('The problem');
    expect(headings).toContain('Before / After');
    expect(headings).toContain('How it works');
    expect(headings).toContain('Try / Inspect it');

    const images = main!.querySelectorAll('img');
    const srcs = images.map((img) => img.getAttribute('src') ?? '');
    expect(srcs).toContain('/images/slop-remover-before.svg');
    expect(srcs).toContain('/images/slop-remover-after.svg');

    for (const img of images) {
      expect(img.getAttribute('alt')?.trim()).toBeTruthy();
      const rel = (img.getAttribute('src') ?? '').replace(/^\//, '');
      const fullPath = resolve(import.meta.dirname, '..', 'dist', rel);
      expect(existsSync(fullPath)).toBe(true);
    }

    const externalLinks = main!
      .querySelectorAll('a')
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => href.startsWith('https://'));
    expect(
      externalLinks.some((href) =>
        href.includes('github.com/eniolaodunaiya/ai-design-slop-remover'),
      ),
    ).toBe(true);

    const form = main!.querySelector('form');
    expect(form).not.toBeNull();
    expect(form!.getAttribute('method')?.toLowerCase()).toBe('post');
    expect(form!.getAttribute('action')).toBe(
      'https://buttondown.com/api/emails/embed-subscribe/eniolaodunaiya',
    );
    const emailInput = form!.querySelector('input[type="email"][name="email"]');
    expect(emailInput).not.toBeNull();
    expect(emailInput!.hasAttribute('required')).toBe(true);

    const title = doc.querySelector('title')?.textContent.trim();
    expect(title).toContain('AI Design Slop-Remover');
    expect(title).toContain('Eniola Odunaiya');

    const metaDesc = doc
      .querySelector('meta[name="description"]')
      ?.getAttribute('content');
    expect(metaDesc).toBeTruthy();

    const canonical = doc
      .querySelector('link[rel="canonical"]')
      ?.getAttribute('href');
    expect(canonical).toBe(
      'https://eniolaodunaiya.com/prototypes/ai-design-slop-remover/',
    );

    expect(
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ).toBe(title);
    expect(
      doc
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content'),
    ).toBe(metaDesc);
    expect(
      doc.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    ).toBe(canonical);
    expect(
      doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
    ).toBe('summary');

    expect(doc.querySelectorAll('script')).toHaveLength(0);
  });

  it('displays the featured Prototype card on the Home page linking directly to AI Design Slop-Remover', () => {
    const doc = readHtml('index.html');
    const main = doc.querySelector('main');
    expect(main).not.toBeNull();

    const featuredSection = main!
      .querySelectorAll('section')
      .find((section) => /Featured Prototype/i.test(section.textContent));
    expect(featuredSection).toBeDefined();

    const sectionText = featuredSection!.textContent;
    expect(sectionText).toContain('AI Design Slop-Remover');
    expect(sectionText).toContain('AI Craft');

    const directLinks = featuredSection!
      .querySelectorAll('a')
      .filter((a) => a.getAttribute('href') === '/prototypes/ai-design-slop-remover');
    expect(directLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('fails the Astro build when Prototype frontmatter has an invalid scope or missing title', () => {
    expectBuildFailureWithPrototype(`---
title: Invalid Scope Prototype
summary: Uses an unsupported scope value.
published: true
order: 2
featured: false
scope: Marketing
---

Body
`);

    expectBuildFailureWithPrototype(`---
summary: Missing required title field.
published: true
order: 3
featured: false
scope: AI Craft
---

Body
`);
  });
});
