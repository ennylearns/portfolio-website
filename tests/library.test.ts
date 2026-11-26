import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildSite, readHtml } from './helpers/site';

const ROOT_DIR = resolve(import.meta.dirname, '..');
const PLAYBOOKS_DIR = resolve(ROOT_DIR, 'src/content/playbooks');
const ESSAYS_DIR = resolve(ROOT_DIR, 'src/content/essays');

function writeFixture(dir: string, filename: string, content: string): string {
  mkdirSync(dir, { recursive: true });
  const filePath = resolve(dir, filename);
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

function removeFixtures(paths: string[]): void {
  for (const filePath of paths) {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}

describe('Library Day-1 empty state and schema validation (built static site)', () => {
  const createdFiles: string[] = [];

  afterAll(() => {
    removeFixtures(createdFiles);
    createdFiles.length = 0;
  });

  it('hides Library from top nav on Home and About in Day-1 empty state', () => {
    buildSite();

    for (const page of ['index.html', 'about/index.html']) {
      const doc = readHtml(page);
      const nav = doc.querySelector('header nav');
      expect(nav).not.toBeNull();
      const navHrefs = nav!
        .querySelectorAll('a')
        .map((a) => a.getAttribute('href'));
      expect(navHrefs).not.toContain('/library');
      expect(nav!.textContent).not.toMatch(/\bLibrary\b/i);
    }
  });

  it('fails astro build when frontmatter uses an invalid Theme', () => {
    const badFixture = writeFixture(
      ESSAYS_DIR,
      '_test-invalid-theme.md',
      `---
title: "Invalid Theme Essay"
summary: "Should fail schema validation."
published: true
theme: "Technology"
---

Body text.
`,
    );
    createdFiles.push(badFixture);

    try {
      expect(() => buildSite()).toThrow();
    } finally {
      removeFixtures([badFixture]);
    }
  });
});

describe('Library populated state with Playbooks, Essays, and Theme filters (built static site)', () => {
  const createdFiles: string[] = [];

  beforeAll(() => {
    try {
      createdFiles.push(
        writeFixture(
          PLAYBOOKS_DIR,
          '_test-daily-life-playbook.md',
          `---
title: "WhatsApp Receipt Checklist"
summary: "A practical checklist for Nigerian households and solo operators."
published: true
theme: "Daily Life"
publishedAt: "2026-03-01"
---

## Step 1

Keep every receipt in one place.
`,
        ),
        writeFixture(
          PLAYBOOKS_DIR,
          '_test-business-playbook.md',
          `---
title: "Customer Follow-Up Playbook"
summary: "Automate polite follow-ups for Lagos retail stores."
published: true
theme: "Business"
publishedAt: "2026-03-05"
---

## Step 1

Draft concise replies.
`,
        ),
        writeFixture(
          ESSAYS_DIR,
          '_test-economy-essay.md',
          `---
title: "AI and Productive Informal Trade"
summary: "How practical software tools affect productivity across African markets."
published: true
theme: "Economy"
publishedAt: "2026-03-10"
---

Long-form analysis of AI in the Nigerian and broader African economy.
`,
        ),
        writeFixture(
          ESSAYS_DIR,
          '_test-unpublished-draft.md',
          `---
title: "Unpublished Draft Essay"
summary: "Should never appear on the built site."
published: false
theme: "Business"
---

Draft only.
`,
        ),
      );
      buildSite();
    } catch (err) {
      removeFixtures(createdFiles);
      createdFiles.length = 0;
      throw err;
    }
  });

  afterAll(() => {
    removeFixtures(createdFiles);
    createdFiles.length = 0;
    buildSite();
  });

  it('reveals Library in top nav on Home, About, and Library pages', () => {
    for (const page of ['index.html', 'about/index.html', 'library/index.html']) {
      const doc = readHtml(page);
      const nav = doc.querySelector('header nav');
      expect(nav).not.toBeNull();
      const libraryLink = nav!
        .querySelectorAll('a')
        .find((a) => a.getAttribute('href') === '/library');
      expect(libraryLink).toBeDefined();
      expect(libraryLink!.textContent.trim()).toBe('Library');
      if (page === 'library/index.html') {
        expect(libraryLink!.getAttribute('aria-current')).toBe('page');
      }
    }
  });

  it('renders all published Playbooks and Essays with type and Theme badges and excludes unpublished drafts', () => {
    const doc = readHtml('library/index.html');
    const main = doc.querySelector('main');
    expect(main).not.toBeNull();

    const text = main!.textContent;
    expect(text).toContain('WhatsApp Receipt Checklist');
    expect(text).toContain('Customer Follow-Up Playbook');
    expect(text).toContain('AI and Productive Informal Trade');
    expect(text).not.toContain('Unpublished Draft Essay');

    expect(text).toContain('Playbook');
    expect(text).toContain('Essay');
    expect(text).toContain('Daily Life');
    expect(text).toContain('Business');
    expect(text).toContain('Economy');

    const filterNav = main!.querySelector('nav[aria-label*="Theme" i]');
    expect(filterNav).not.toBeNull();
    const filterLinks = filterNav!.querySelectorAll('a').map((a) => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href'),
      ariaCurrent: a.getAttribute('aria-current'),
    }));
    expect(filterLinks).toEqual([
      { text: 'All', href: '/library', ariaCurrent: 'page' },
      { text: 'Daily Life', href: '/library/daily-life', ariaCurrent: undefined },
      { text: 'Business', href: '/library/business', ariaCurrent: undefined },
      { text: 'Economy', href: '/library/economy', ariaCurrent: undefined },
    ]);

    expect(doc.querySelectorAll('script')).toHaveLength(0);
  });

  it('filters Work cleanly across /library/daily-life, /library/business, and /library/economy with zero scripts', () => {
    const dailyLifeDoc = readHtml('library/daily-life/index.html');
    const dailyLifeText = dailyLifeDoc.querySelector('main')!.textContent;
    expect(dailyLifeText).toContain('WhatsApp Receipt Checklist');
    expect(dailyLifeText).not.toContain('Customer Follow-Up Playbook');
    expect(dailyLifeText).not.toContain('AI and Productive Informal Trade');
    expect(dailyLifeDoc.querySelectorAll('script')).toHaveLength(0);

    const businessDoc = readHtml('library/business/index.html');
    const businessText = businessDoc.querySelector('main')!.textContent;
    expect(businessText).toContain('Customer Follow-Up Playbook');
    expect(businessText).not.toContain('WhatsApp Receipt Checklist');
    expect(businessText).not.toContain('AI and Productive Informal Trade');
    expect(businessText).not.toContain('Unpublished Draft Essay');
    expect(businessDoc.querySelectorAll('script')).toHaveLength(0);

    const economyDoc = readHtml('library/economy/index.html');
    const economyText = economyDoc.querySelector('main')!.textContent;
    expect(economyText).toContain('AI and Productive Informal Trade');
    expect(economyText).not.toContain('WhatsApp Receipt Checklist');
    expect(economyText).not.toContain('Customer Follow-Up Playbook');
    expect(economyDoc.querySelectorAll('script')).toHaveLength(0);
  });

  it('renders Playbook and Essay detail pages with SEO/OG metadata, long-form prose, bottom Subscriber prompt, and zero scripts', () => {
    const libraryDoc = readHtml('library/index.html');
    const mainLinks = libraryDoc
      .querySelector('main')!
      .querySelectorAll('a')
      .map((a) => a.getAttribute('href'));

    expect(mainLinks).toContain('/library/playbooks/_test-daily-life-playbook');
    expect(mainLinks).toContain('/library/essays/_test-economy-essay');

    const cases = [
      {
        distPath: 'library/playbooks/_test-daily-life-playbook/index.html',
        canonical:
          'https://eniolaodunaiya.com/library/playbooks/_test-daily-life-playbook/',
        title: 'WhatsApp Receipt Checklist',
        summary:
          'A practical checklist for Nigerian households and solo operators.',
        kind: 'Playbook',
        theme: 'Daily Life',
        bodySnippet: 'Keep every receipt in one place.',
      },
      {
        distPath: 'library/essays/_test-economy-essay/index.html',
        canonical:
          'https://eniolaodunaiya.com/library/essays/_test-economy-essay/',
        title: 'AI and Productive Informal Trade',
        summary:
          'How practical software tools affect productivity across African markets.',
        kind: 'Essay',
        theme: 'Economy',
        bodySnippet:
          'Long-form analysis of AI in the Nigerian and broader African economy.',
      },
    ];

    for (const item of cases) {
      const doc = readHtml(item.distPath);
      const main = doc.querySelector('main');
      expect(main).not.toBeNull();

      const h1 = main!.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1!.textContent).toContain(item.title);

      const mainText = main!.textContent;
      expect(mainText).toContain(item.kind);
      expect(mainText).toContain(item.theme);
      expect(mainText).toContain(item.bodySnippet);

      const title = doc.querySelector('title')?.textContent.trim();
      expect(title).toContain(item.title);
      expect(title).toContain('Eniola Odunaiya');

      expect(
        doc.querySelector('meta[name="description"]')?.getAttribute('content'),
      ).toBe(item.summary);
      expect(
        doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ).toBe(item.canonical);
      expect(
        doc.querySelector('meta[property="og:type"]')?.getAttribute('content'),
      ).toBe('article');
      expect(
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      ).toBe(title);
      expect(
        doc
          .querySelector('meta[property="og:description"]')
          ?.getAttribute('content'),
      ).toBe(item.summary);
      expect(
        doc.querySelector('meta[property="og:url"]')?.getAttribute('content'),
      ).toBe(item.canonical);
      expect(
        doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
      ).toBe('summary');
      expect(
        doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
      ).toBe(title);
      expect(
        doc
          .querySelector('meta[name="twitter:description"]')
          ?.getAttribute('content'),
      ).toBe(item.summary);

      const form = main!.querySelector('form');
      expect(form).not.toBeNull();
      expect(form!.getAttribute('action')).toBe(
        'https://buttondown.com/api/emails/embed-subscribe/eniolaodunaiya',
      );
      expect(form!.querySelector('input[type="email"]')).not.toBeNull();
      const formSectionText =
        form!.closest('section')?.textContent ?? form!.textContent;
      expect(formSectionText).toMatch(/no\s+(?:fixed\s+)?schedule/i);

      expect(doc.querySelectorAll('script')).toHaveLength(0);
    }

    expect(
      existsSync(
        resolve(
          ROOT_DIR,
          'dist/library/essays/_test-unpublished-draft/index.html',
        ),
      ),
    ).toBe(false);
  });
});
