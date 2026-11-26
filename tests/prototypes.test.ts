import { beforeAll, describe, expect, it } from 'vitest';
import {
  buildSite,
  createTempSite,
  distExists,
  expectSeoMetadata,
  readHtml,
} from './helpers/site';

function expectBuildFailureWithPrototype(frontmatter: string): void {
  const site = createTempSite('astro-invalid-proto-');
  try {
    site.writeContent('prototypes/invalid-prototype.md', frontmatter);
    expect(() => site.build()).toThrow();
  } finally {
    site.cleanup();
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

    expectSeoMetadata(doc, {
      canonical: 'https://eniolaodunaiya.com/prototypes/',
      titleContains: ['Prototypes', 'Eniola Odunaiya'],
    });

    expect(doc.querySelectorAll('script')).toHaveLength(0);
  });

  it('renders AI Design Slop-Remover Prototype detail page with scope badge, all 4 sections, Before/After SVGs, Try/Inspect links outside header, SEO metadata, bottom Subscriber prompt, and zero scripts', () => {
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

    const prototypeHeader = main!.querySelector('header.prototype-header');
    expect(prototypeHeader).not.toBeNull();
    const headerExternalLinks = prototypeHeader!
      .querySelectorAll('a')
      .filter((a) => (a.getAttribute('href') ?? '').startsWith('https://'));
    expect(headerExternalLinks).toHaveLength(0);

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
      expect(distExists(rel)).toBe(true);
    }

    const article = main!.querySelector('article');
    expect(article).not.toBeNull();
    const tryLinksContainer = article!.querySelector('.prototype-try-links');
    expect(tryLinksContainer).not.toBeNull();

    const tryHrefs = tryLinksContainer!
      .querySelectorAll('a')
      .map((a) => a.getAttribute('href') ?? '');
    expect(tryHrefs).toContain(
      'https://github.com/eniolaodunaiya/ai-design-slop-remover',
    );
    expect(tryHrefs).toContain(
      'https://github.com/eniolaodunaiya/ai-design-slop-remover#quick-start',
    );

    const articleHtml = article!.innerHTML;
    expect(articleHtml.indexOf('Try / Inspect it')).toBeGreaterThan(-1);
    expect(articleHtml.indexOf('prototype-try-links')).toBeGreaterThan(
      articleHtml.indexOf('Try / Inspect it'),
    );

    const form = main!.querySelector('form');
    expect(form).not.toBeNull();
    expect(form!.getAttribute('method')?.toLowerCase()).toBe('post');
    expect(form!.getAttribute('action')).toBe(
      'https://buttondown.com/api/emails/embed-subscribe/eniolaodunaiya',
    );
    const emailInput = form!.querySelector('input[type="email"][name="email"]');
    expect(emailInput).not.toBeNull();
    expect(emailInput!.hasAttribute('required')).toBe(true);

    expectSeoMetadata(doc, {
      canonical: 'https://eniolaodunaiya.com/prototypes/ai-design-slop-remover/',
      ogType: 'article',
      titleContains: ['AI Design Slop-Remover', 'Eniola Odunaiya'],
    });

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
