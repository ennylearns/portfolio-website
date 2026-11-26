import { beforeAll, describe, expect, it } from 'vitest';
import {
  buildSite,
  distExists,
  expectSeoMetadata,
  readDistFile,
  readHtml,
} from './helpers/site';

describe('Home page (built static site)', () => {
  beforeAll(() => {
    buildSite();
  });

  it('renders practical AI thesis for Nigeria and Africa, and bio link to About', () => {
    const doc = readHtml('index.html');
    const main = doc.querySelector('main');
    expect(main).not.toBeNull();

    const text = main!.textContent;
    expect(text).toMatch(/practical AI/i);
    expect(text).toContain('Nigeria');
    expect(text).toContain('Africa');

    const aboutLinks = main!
      .querySelectorAll('a')
      .filter((a) => {
        const href = a.getAttribute('href');
        return href === '/about' || href === '/about/';
      });
    expect(aboutLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Header with Eniola Odunaiya and active nav links (Home, Prototypes, About; no Library yet)', () => {
    const doc = readHtml('index.html');
    const header = doc.querySelector('header');
    expect(header).not.toBeNull();
    expect(header!.textContent).toContain('Eniola Odunaiya');

    const nav = header!.querySelector('nav');
    expect(nav).not.toBeNull();

    const navLinks = nav!.querySelectorAll('a').map((a) => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href'),
      ariaCurrent: a.getAttribute('aria-current'),
    }));

    expect(navLinks).toEqual([
      { text: 'Home', href: '/', ariaCurrent: 'page' },
      { text: 'Prototypes', href: '/prototypes', ariaCurrent: undefined },
      { text: 'About', href: '/about', ariaCurrent: undefined },
    ]);

    expect(header!.textContent).not.toMatch(/\bLibrary\b/i);
  });

  it('renders Footer with X/Twitter, LinkedIn, GitHub, direct email, and copyright', () => {
    const doc = readHtml('index.html');
    const footer = doc.querySelector('footer');
    expect(footer).not.toBeNull();

    const links = footer!.querySelectorAll('a').map((a) => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href') ?? '',
    }));

    expect(links.some((l) => /x\.com|twitter\.com/i.test(l.href))).toBe(true);
    expect(links.some((l) => /linkedin\.com/i.test(l.href))).toBe(true);
    expect(links.some((l) => /github\.com/i.test(l.href))).toBe(true);
    expect(links.some((l) => l.href.startsWith('mailto:'))).toBe(true);

    expect(footer!.textContent).toMatch(/©|copyright/i);
    expect(footer!.textContent).toContain('Eniola Odunaiya');
  });

  it('outputs semantic headings, SEO title/description, Open Graph & Twitter metadata, and zero script tags', () => {
    const doc = readHtml('index.html');

    const h2 = doc.querySelector('h2');
    expect(h2).not.toBeNull();

    expectSeoMetadata(doc, {
      canonical: 'https://eniolaodunaiya.com/',
      titleContains: ['Eniola Odunaiya'],
      descriptionContains: ['Nigeria'],
    });

    expect(doc.querySelectorAll('script')).toHaveLength(0);
  });

  it('ships light-mode editorial CSS with Google Sans and without gradients', () => {
    const doc = readHtml('index.html');
    const stylesheetLinks = doc.querySelectorAll('link[rel="stylesheet"]');
    const inlineStyles = doc.querySelectorAll('style');
    expect(stylesheetLinks.length + inlineStyles.length).toBeGreaterThanOrEqual(1);

    const cssParts: string[] = inlineStyles.map((s) => s.textContent);

    for (const link of stylesheetLinks) {
      const href = link.getAttribute('href') ?? '';
      if (/^https?:\/\//i.test(href)) {
        expect(href).toContain('fonts.googleapis.com');
        continue;
      }
      const rel = href.replace(/^\//, '');
      expect(distExists(rel)).toBe(true);
      cssParts.push(readDistFile(rel));
    }

    const combinedCss = cssParts.join('\n').toLowerCase();

    expect(combinedCss).toMatch(/color-scheme:\s*light/);
    expect(combinedCss).toContain('#faf8f5');
    expect(combinedCss).toContain('#1a1918');
    expect(combinedCss).toContain('#9a3412');
    expect(combinedCss).toContain('google sans');
    expect(combinedCss).not.toContain('linear-gradient');
    expect(combinedCss).not.toContain('radial-gradient');
  });
});
