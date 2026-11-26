import { beforeAll, describe, expect, it } from 'vitest';
import { buildSite, readHtml } from './helpers/site';

function expectSubscriberForm(relativePath: string): void {
  const doc = readHtml(relativePath);
  const main = doc.querySelector('main');
  expect(main).not.toBeNull();

  const form = main!.querySelector('form');
  expect(form).not.toBeNull();
  expect(form!.getAttribute('method')?.toLowerCase()).toBe('post');
  expect(form!.getAttribute('action')).toBe(
    'https://buttondown.com/api/emails/embed-subscribe/eniolaodunaiya',
  );

  const emailInput = form!.querySelector('input[type="email"]');
  expect(emailInput).not.toBeNull();
  expect(emailInput!.getAttribute('name')).toBe('email');
  expect(emailInput!.hasAttribute('required')).toBe(true);

  const emailId = emailInput!.getAttribute('id');
  expect(emailId).toBeTruthy();
  const label = form!.querySelector(`label[for="${emailId}"]`);
  expect(label).not.toBeNull();

  const submitControl = form!.querySelector(
    'button[type="submit"], input[type="submit"]',
  );
  expect(submitControl).not.toBeNull();

  const formContainerText =
    form!.closest('section')?.textContent ?? form!.textContent;
  expect(formContainerText).toMatch(/no\s+(?:fixed\s+)?schedule/i);
  expect(formContainerText).toMatch(/when new\s+Work\s+ships/i);

  expect(doc.querySelectorAll('script')).toHaveLength(0);
}

describe('About page & Subscriber signup (built static site)', () => {
  beforeAll(() => {
    buildSite();
  });

  it('renders About page with Eniola Odunaiya story, Nigeria/Africa AI mission, contact/distribution links, SEO/social metadata, and zero scripts', () => {
    const doc = readHtml('about/index.html');
    const main = doc.querySelector('main');
    expect(main).not.toBeNull();

    const mainText = main!.textContent;
    expect(mainText).toContain('Eniola Odunaiya');
    expect(mainText).toMatch(/practical AI/i);
    expect(mainText).toContain('Nigeria');
    expect(mainText).toContain('Africa');

    const links = main!.querySelectorAll('a').map((a) => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href') ?? '',
    }));

    expect(links.some((l) => /x\.com\/eniolaodunaiya/i.test(l.href))).toBe(true);
    expect(
      links.some((l) => /linkedin\.com\/in\/eniolaodunaiya/i.test(l.href)),
    ).toBe(true);
    expect(links.some((l) => /github\.com\/eniolaodunaiya/i.test(l.href))).toBe(
      true,
    );
    expect(
      links.some((l) => l.href === 'mailto:hello@eniolaodunaiya.com'),
    ).toBe(true);

    const nav = doc.querySelector('header nav');
    expect(nav).not.toBeNull();
    const aboutNavLink = nav!
      .querySelectorAll('a')
      .find((a) => a.getAttribute('href') === '/about');
    expect(aboutNavLink?.getAttribute('aria-current')).toBe('page');

    const h1 = doc.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toMatch(/About|Eniola Odunaiya/i);

    const title = doc.querySelector('title')?.textContent.trim();
    expect(title).toBeTruthy();
    expect(title).toContain('About');
    expect(title).toContain('Eniola Odunaiya');

    const metaDesc = doc
      .querySelector('meta[name="description"]')
      ?.getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc).toContain('Nigeria');

    const canonical = doc
      .querySelector('link[rel="canonical"]')
      ?.getAttribute('href');
    expect(canonical).toBe('https://eniolaodunaiya.com/about/');

    expect(
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ).toBe(title);
    expect(
      doc
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content'),
    ).toBe(metaDesc);
    expect(
      doc.querySelector('meta[property="og:type"]')?.getAttribute('content'),
    ).toBe('website');
    expect(
      doc.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    ).toBe(canonical);

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
    ).toBe(metaDesc);

    expect(doc.querySelectorAll('script')).toHaveLength(0);
  });

  it('renders Buttondown Subscriber signup form with no-schedule copy on Home', () => {
    expectSubscriberForm('index.html');
  });

  it('renders Buttondown Subscriber signup form with no-schedule copy on About', () => {
    expectSubscriberForm('about/index.html');
  });
});
