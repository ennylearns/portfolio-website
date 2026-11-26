# Eniola Odunaiya — Personal Website (Practical AI for Nigeria & Africa)

Status: resolved

## Problem Statement

Eniola Odunaiya, an AI builder-writer in Nigeria, wants to increase personal online visibility by teaching African founders, small-business operators, and ecosystem decision-makers how practical AI improves daily life, strengthens businesses, and grows the African economy. Today, there is no dedicated home to showcase working **Prototypes**, publish step-by-step **Playbooks** and economic **Essays**, or convert interested **Readers** into long-term **Subscribers**—and generic portfolio or blog templates fail because they encourage empty "coming soon" sections, require unsustainable publishing schedules, and ship bloated pages that load poorly on Nigerian mobile networks.

## Solution

Build a fast, editorial-style static personal website anchored in **Eniola Odunaiya**'s personal name and focused on practical AI in Nigeria with pan-African relevance. The site launches lean on Day 1 with Eniola's first **Prototype** (an AI design slop-remover skill) featured prominently alongside a clear thesis, About page, distribution links, and a no-schedule **Subscriber** email signup powered by Buttondown. The **Library** for **Playbooks** and **Essays** (organized into three fixed **Themes**: `Daily Life`, `Business`, `Economy`) is built and ready from the start, but remains hidden from top navigation until Eniola publishes the first **Playbook** or **Essay**. Publishing any new **Prototype**, **Playbook**, or **Essay** requires only adding a plain Markdown/MDX document and pushing to deploy on Cloudflare's free static hosting tier.

## User Stories

1. As a **Reader**, I want to land on the Home page and immediately read **Eniola Odunaiya**'s name and core thesis on practical AI for Nigeria and Africa, so that I understand who the author is and why this site matters within seconds.
2. As a **Reader**, I want to see the author's featured **Prototype** right on the Home page, so that I immediately see concrete proof of work rather than abstract claims.
3. As a **Reader**, I want to read a short bio on the Home page with a link to the full About page, so that I can quickly gauge the author's credibility as a builder-writer.
4. As a **Reader**, I want to enter my email in a clean, distraction-free signup form on the Home page to become a **Subscriber**, so that I get notified whenever new **Work** is published without being spammed on an arbitrary schedule.
5. As a **Reader**, I want the email signup form to clearly state that emails are sent only when new **Work** ships (no fixed schedule), so that I trust the signup and know what to expect.
6. As a **Reader**, I want the top navigation on Day 1 to show only active sections (Home, Prototypes, About) and hide the **Library** while it is empty, so that I never click into an unfinished "coming soon" page.
7. As a **Reader**, I want to visit the Prototypes page and browse all published **Prototypes** with a clear scope label (`AI Craft` or `Nigeria / Africa`), so that I can distinguish general AI craft tools from Nigeria/Africa-specific workflows.
8. As a **Reader**, I want to open the AI design slop-remover **Prototype** page and read **The problem** section, so that I understand why generic AI-generated designs hurt trust for Nigerian and African businesses.
9. As a **Reader**, I want to inspect a **Before / After** visual showcase on the design slop-remover **Prototype** page, so that I can see concrete proof of the skill removing AI design slop.
10. As a **Reader**, I want to read a plain-English **How it works** section on the **Prototype** page, so that I understand what the tool evaluates and fixes without needing deep engineering jargon.
11. As a **Reader**, I want a **Try / Inspect it** section on the **Prototype** page with working links to the repository, install instructions, or external demo, so that I can immediately apply or test the skill myself.
12. As a **Reader**, I want to visit the About page to read the author's full story and motivation for advancing practical AI in Nigeria and across Africa, so that I can connect with the person behind the work.
13. As a **Reader**, I want to find links to the author's X/Twitter, LinkedIn, GitHub, and direct email on both the About page and site footer, so that I can follow the author's distribution channels or reach out directly.
14. As a **Reader**, I want to subscribe to the email list from the About page as well as the Home page, so that I can opt in right after learning about the author.
15. As a **Reader** on a slow or metered Nigerian mobile connection, I want every page to load rapidly with minimal payload and readable typography on small screens, so that I can read comfortably anywhere without burning data.
16. As a **Reader**, I want the site's visual design to feel editorial, crisp, light-mode, and intentional—with generous whitespace and zero generic AI-gradient aesthetics—so that the site itself proves the author's taste and craft.
17. As a **Reader**, I want to navigate cleanly between Home, Prototypes, Library (once active), and About on both mobile and desktop screens, so that I never get lost or hit broken links.
18. As a **Reader** (once the first **Playbook** or **Essay** is published), I want the **Library** link to appear in the top navigation automatically, so that I can discover the author's **Playbooks** and **Essays**.
19. As a **Reader** in the **Library**, I want to clearly see whether each **Work** is a **Playbook** or an **Essay** and which **Theme** (`Daily Life`, `Business`, `Economy`) it belongs to, so that I can pick the exact format and focus I need.
20. As a **Reader** in the **Library**, I want to filter **Work** by **Theme** (`Daily Life`, `Business`, or `Economy`), so that I can focus on practical business workflows, everyday AI use cases, or macro economic analysis.
21. As a **Reader**, I want to open any **Playbook** and read a clean, well-structured step-by-step guide anchored in real Nigerian examples, so that I can apply AI directly to my daily life or business.
22. As a **Reader**, I want to open any **Essay** and read comfortable long-form prose with clean editorial typography, so that I can absorb the author's perspective on AI and the African economy.
23. As a **Reader** finishing any **Work**, I want a subtle prompt at the bottom to become a **Subscriber**, so that I can stay updated right when the value of the site is clearest.
24. As the author, I want to publish new **Work** by adding a single Markdown/MDX document with validated metadata, so that maintaining the site stays low-friction and evergreen.
25. As the author, I want the build to fail immediately if a Markdown/MDX document has missing required metadata or an invalid **Theme** or **Prototype** scope, so that broken or misclassified **Work** never ships to production.
26. As the author, I want the **Library** navigation link to stay hidden automatically when zero **Playbooks** and zero **Essays** exist, and appear automatically as soon as I add the first one, so that I never have to manually edit navigation code when I start publishing.
27. As the author, I want to deploy updates automatically by pushing to GitHub on Cloudflare's free static hosting tier (Workers Static Assets / Pages), so that hosting costs nothing, scales to unlimited static traffic, and serves fast from Lagos and African edge nodes.
28. As a **Reader** sharing a link to the Home page or any **Work** on X/Twitter or LinkedIn, I want clean page titles and metadata previews, so that shared links look credible and increase the author's online visibility.

## Implementation Decisions

- **Static-first framework (ADR-0001)**: Build with Astro using local Markdown/MDX content collections. Ship zero unnecessary client-side JavaScript on editorial pages to maximize load speed on Nigerian mobile networks.
- **Content collections & schema contracts**: Define three typed content collections matching the domain glossary:
  - **Prototypes collection**: Requires title, summary, published status/order, scope (`AI Craft` or `Nigeria / Africa`), featured flag, optional external repo/demo links, and body content structured around the 4 sections (*The problem*, *Before / After*, *How it works*, *Try / Inspect it*).
  - **Playbooks collection**: Requires title, summary, **Theme** (strictly one of `Daily Life`, `Business`, `Economy`), and published flag.
  - **Essays collection**: Requires title, summary, **Theme** (strictly one of `Daily Life`, `Business`, `Economy`), and published flag.
- **Automatic Day-1 Library gating**: Derive **Library** visibility dynamically from whether the combined count of published **Playbooks** and **Essays** is greater than zero. When zero, omit **Library** from top navigation (while keeping the **Library** page template and **Theme** filtering logic built and ready).
- **Editorial design system**: Build a single cohesive light-mode editorial layout with crisp typography, generous whitespace, a grounded warm accent color, responsive mobile-first spacing, and zero generic AI-slop visual tropes (no neon/purple gradients, no decorative bloat).
- **Page architecture**: Implement four core page modules plus detail views:
  - **Home**: **Eniola Odunaiya** brand header, Nigeria/Africa AI thesis, featured **Prototype** card, short bio, Buttondown **Subscriber** signup form.
  - **Prototypes** (index + detail): Lists all published **Prototypes** with scope badges; detail view renders the 4-section layout including responsive before/after visual comparison.
  - **Library** (index + detail views for **Playbooks** and **Essays**): Lists published **Playbooks** and **Essays** with type indicator and **Theme** filtering (`Daily Life`, `Business`, `Economy`), implemented with minimal or progressive-enhancement interaction so it still works cleanly on low-end mobile browsers.
  - **About**: Eniola Odunaiya's story, Nigeria/Africa AI mission, Buttondown **Subscriber** signup form, and distribution/contact links.
- **Shared chrome**: Header navigation (**Eniola Odunaiya** + active routes) and Footer (X/Twitter, LinkedIn, GitHub, direct email, copyright).
- **Subscriber email capture**: Integrate a standard HTML form posting to Buttondown (configurable via environment/site config so the author can drop in their Buttondown username before launch without touching layout code).
- **External live demos**: Per ADR-0001, any interactive AI tools requiring server compute remain hosted externally and are linked from their **Prototype** page's *Try / Inspect it* section.
- **SEO & social sharing metadata**: Every page renders semantic HTML headings, descriptive `<title>`, meta description, and Open Graph / Twitter Card metadata so links shared on X/Twitter and LinkedIn preview cleanly.
- **Deployment target**: Configure static output for Cloudflare Workers Static Assets / Cloudflare Pages with automatic deploy on push.

## Testing Decisions

- **Single testing seam**: Test at the highest boundary—the **built static site output** (building the Astro site and asserting against the rendered HTML pages and preview server).
- **What makes a good test**: Assert strictly on external behavior that **Readers** experience (rendered navigation items, visible sections, links, form attributes, **Theme** filtering behavior, and build-time schema validation). Do not test internal helper functions, Astro component internals, or brittle CSS class names.
- **Coverage at the seam**:
  - **Navigation & Day-1 Library rule**: Verify Home, Prototypes, and About render and resolve cleanly; verify **Library** is absent from top navigation when zero **Playbooks** and zero **Essays** are published, and appears once a **Playbook** or **Essay** exists.
  - **Prototype page**: Verify scope label (`AI Craft` or `Nigeria / Africa`) and all four sections (*The problem*, *Before / After*, *How it works*, *Try / Inspect it*) render for the design slop-remover **Prototype**.
  - **Library & Themes**: Verify **Playbooks** and **Essays** render with their content type and **Theme** (`Daily Life`, `Business`, `Economy`) and can be filtered by **Theme**.
  - **Subscriber CTA & distribution links**: Verify Buttondown signup form renders on Home and About with valid action and email input; verify X/Twitter, LinkedIn, GitHub, and email links render in the footer and About page.
  - **Schema & lightweight payload**: Verify invalid frontmatter (e.g., an unsupported **Theme** or missing required field) fails the Astro build, and verify editorial pages do not ship unnecessary client-side JavaScript bundles.
- **Prior art**: None yet (greenfield repository). This establishes the project's test baseline.

## Out of Scope

- Writing or publishing the first **Playbook** or **Essay** for Day-1 launch (the author starts with only the design slop-remover **Prototype**).
- Hosting live backend AI apps, APIs, or databases inside this repository (per ADR-0001, interactive AI apps are linked externally).
- User authentication, comments, likes, or community forums.
- Dark mode toggle, complex animations, or heavy client-side SPA routing.
- CMS dashboards (Notion/Sanity/Contentful) — authoring is local Markdown/MDX files only.
- Analytics scripts or third-party tracking pixels that bloat page weight (can be added later via Cloudflare Web Analytics if desired).

## Further Notes

- **Author inputs needed before final launch copy**: Domain name, X/Twitter URL, LinkedIn URL, GitHub URL, contact email, Buttondown username, and the real before/after visuals + repo/install link for the AI design slop-remover **Prototype**. Clean, obvious placeholders may be used during scaffolding and swapped in before launch.
- **Domain & ADR references**: All domain terminology follows `GLOSSARY.md` (`Reader`, `Subscriber`, `Work`, `Playbook`, `Prototype`, `Essay`, `Library`, `Theme`), and static architecture follows `docs/adr/0001-astro-static-markdown.md`.
