# 03: Prototypes showcase & AI design slop-remover page

**What to build:** Enable Eniola Odunaiya to publish **Prototypes** as validated Markdown/MDX documents with a required scope (`AI Craft` or `Nigeria / Africa`), launch the Prototypes index page and Home featured **Prototype** card, and ship the complete 4-section detail page for the AI design slop-remover **Prototype** (*The problem*, *Before / After*, *How it works*, *Try / Inspect it*) ending with a subtle **Subscriber** signup prompt.

**Blocked by:** 02: About page & Buttondown Subscriber signup

**Status:** resolved

- [x] **Prototypes** Markdown/MDX collection validates title, summary, published flag/order, featured flag, scope (`AI Craft` or `Nigeria / Africa`), and optional external repository/demo links, failing the build on missing or invalid metadata
- [x] Prototypes index page lists published **Prototypes** with visible scope badges (`AI Craft` or `Nigeria / Africa`) and links to each detail page
- [x] Home page displays the featured **Prototype** card linking directly to the AI design slop-remover detail page
- [x] AI design slop-remover **Prototype** detail page renders all 4 sections (*The problem*, *Before / After* visual showcase, *How it works*, *Try / Inspect it* with external link(s)), SEO/Open Graph metadata, and a bottom **Subscriber** signup prompt
- [x] Built-site tests verify the Prototypes index, Home featured card, all 4 detail sections, scope badge, bottom **Subscriber** prompt, and build failure on invalid **Prototype** frontmatter

## Comments

- Resolved on integration branch `feat/personal-website` (merged from `ticket/03-prototypes-and-slop-remover` and updated in code-review fix commit `1b4f89c`, verified via `pnpm build && pnpm test`).
