import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  buildSite,
  createTempSite,
  expectSeoMetadata,
  readHtml,
  type TempSite,
} from './helpers/site';

describe('Library Day-1 empty state and schema validation (built static site)', () => {
  it('hides Library from top nav on Home, About, and Prototypes in Day-1 empty state', () => {
    buildSite();

    for (const page of ['index.html', 'about/index.html', 'prototypes/index.html']) {
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
    const site = createTempSite('astro-invalid-theme-');
    try {
      site.writeContent(
        'essays/_test-invalid-theme.md',
        `---
title: "Invalid Theme Essay"
summary: "Should fail schema validation."
published: true
theme: "Technology"
---

Body text.
`,
      );

      expect(() => site.build()).toThrow();
    } finally {
      site.cleanup();
    }
  });
});

describe('Library populated state with Playbooks, Essays, and Theme filters (isolated temp build)', () => {
  let site: TempSite;

  beforeAll(() => {
    site = createTempSite('astro-populated-library-');
    site.writeContent(
      'playbooks/_test-daily-life-playbook.md',
      `---
title: "WhatsApp Receipt Checklist"
summary: "A practical checklist for Nigerian households and solo operators."
published: true
theme: "Daily Life"
---

## Step 1

Keep every receipt in one place.
`,
    );
    site.writeContent(
      'playbooks/_test-business-playbook.md',
      `---
title: "Customer Follow-Up Playbook"
summary: "Automate polite follow-ups for Lagos retail stores."
published: true
theme: "Business"
---

## Step 1

Draft concise replies.
`,
    );
    site.writeContent(
      'essays/_test-economy-essay.md',
      `---
title: "AI and Productive Informal Trade"
summary: "How practical software tools affect productivity across African markets."
published: true
theme: "Economy"
---

Long-form analysis of AI in the Nigerian and broader African economy.
`,
    );
    site.writeContent(
      'essays/_test-unpublished-draft.md',
      `---
title: "Unpublished Draft Essay"
summary: "Should never appear on the built site."
published: false
theme: "Business"
---

Draft only.
`,
    );
    site.build();
  });

  afterAll(() => {
    site?.cleanup();
  });

  it('reveals Library in top nav on Home, About, and Library pages', () => {
    for (const page of ['index.html', 'about/index.html', 'library/index.html']) {
      const doc = site.readHtml(page);
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

  it('renders all published Playbooks and Essays with type and Theme badges, excludes unpublished drafts, and omits Subscriber form on index', () => {
    const doc = site.readHtml('library/index.html');
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

    expect(main!.querySelector('form')).toBeNull();
    expectSeoMetadata(doc, {
      canonical: 'https://eniolaodunaiya.com/library/',
      titleContains: ['Library', 'Eniola Odunaiya'],
    });
    expect(doc.querySelectorAll('script')).toHaveLength(0);
  });

  it('filters Work cleanly across /library/daily-life, /library/business, and /library/economy with zero scripts', () => {
    const dailyLifeDoc = site.readHtml('library/daily-life/index.html');
    const dailyLifeText = dailyLifeDoc.querySelector('main')!.textContent;
    expect(dailyLifeText).toContain('WhatsApp Receipt Checklist');
    expect(dailyLifeText).not.toContain('Customer Follow-Up Playbook');
    expect(dailyLifeText).not.toContain('AI and Productive Informal Trade');
    expect(dailyLifeDoc.querySelectorAll('script')).toHaveLength(0);

    const businessDoc = site.readHtml('library/business/index.html');
    const businessText = businessDoc.querySelector('main')!.textContent;
    expect(businessText).toContain('Customer Follow-Up Playbook');
    expect(businessText).not.toContain('WhatsApp Receipt Checklist');
    expect(businessText).not.toContain('AI and Productive Informal Trade');
    expect(businessText).not.toContain('Unpublished Draft Essay');
    expect(businessDoc.querySelectorAll('script')).toHaveLength(0);

    const economyDoc = site.readHtml('library/economy/index.html');
    const economyText = economyDoc.querySelector('main')!.textContent;
    expect(economyText).toContain('AI and Productive Informal Trade');
    expect(economyText).not.toContain('WhatsApp Receipt Checklist');
    expect(economyText).not.toContain('Customer Follow-Up Playbook');
    expect(economyDoc.querySelectorAll('script')).toHaveLength(0);
  });

  it('renders Playbook and Essay detail pages with SEO/OG metadata, long-form prose, bottom Subscriber prompt, and zero scripts', () => {
    const libraryDoc = site.readHtml('library/index.html');
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

    for (const workCase of cases) {
      const doc = site.readHtml(workCase.distPath);
      const main = doc.querySelector('main');
      expect(main).not.toBeNull();

      const h1 = main!.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1!.textContent).toContain(workCase.title);

      const mainText = main!.textContent;
      expect(mainText).toContain(workCase.kind);
      expect(mainText).toContain(workCase.theme);
      expect(mainText).toContain(workCase.bodySnippet);

      expectSeoMetadata(doc, {
        canonical: workCase.canonical,
        ogType: 'article',
        titleContains: [workCase.title, 'Eniola Odunaiya'],
        description: workCase.summary,
      });

      const form = main!.querySelector('form');
      expect(form).not.toBeNull();
      expect(form!.getAttribute('action')).toBe(
        'https://buttondown.com/api/emails/embed-subscribe/eniolaodunaiya',
      );
      expect(form!.querySelector('input[type="email"]')).not.toBeNull();
      const formSectionText =
        form!.closest('section')?.textContent ?? form!.textContent;
      expect(formSectionText).toMatch(/when new\s+Work\s+ships/i);

      expect(doc.querySelectorAll('script')).toHaveLength(0);
    }

    expect(
      site.distExists('library/essays/_test-unpublished-draft/index.html'),
    ).toBe(false);
  });
});
