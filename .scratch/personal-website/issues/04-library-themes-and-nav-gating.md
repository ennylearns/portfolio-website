# 04: Library for Playbooks & Essays with Theme filtering & Day-1 nav gating

**What to build:** Build the complete **Library** experience for written **Work** (**Playbooks** and **Essays**) organized strictly under the three fixed **Themes** (`Daily Life`, `Business`, `Economy`), with detail pages and **Theme** filtering—while automatically hiding the **Library** link from top navigation on Day 1 when zero **Playbooks** and zero **Essays** exist, and automatically revealing it as soon as the first one is published.

**Blocked by:** 02: About page & Buttondown Subscriber signup

**Status:** ready-for-agent

- [ ] **Playbooks** and **Essays** Markdown/MDX collections validate title, summary, published flag, and **Theme** (strictly `Daily Life`, `Business`, or `Economy`), failing the build on invalid metadata
- [ ] Top navigation automatically omits **Library** when zero published **Playbooks** and zero published **Essays** exist (Day-1 default state) and includes **Library** automatically once at least one is published
- [ ] **Library** index displays each published **Playbook** and **Essay** with its **Work** type (`Playbook` or `Essay`) and **Theme** badge, and lets **Readers** filter by **Theme** (`Daily Life`, `Business`, `Economy`) in a lightweight, mobile-friendly way
- [ ] **Playbook** and **Essay** detail pages render editorial long-form typography, SEO/Open Graph metadata, and a bottom **Subscriber** signup prompt
- [ ] Built-site tests verify both states: (1) Day-1 empty state hides **Library** from top nav, and (2) populated fixture state shows **Library** in top nav, renders **Playbook**/**Essay** badges, filters cleanly by **Theme**, and fails build on invalid **Theme** frontmatter
