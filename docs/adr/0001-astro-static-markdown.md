# Use Astro with Markdown for static publishing

We chose Astro with local Markdown/MDX files over Next.js or a no-code builder so the site ships minimal HTML/CSS that loads fast on Nigerian mobile networks and lets the author publish a new **Playbook**, **Prototype**, or **Essay** by adding a plain text file.

## Considered Options

- **Astro + Markdown/MDX** (chosen): zero-JS by default, free static hosting, full design control.
- **Next.js**: heavier client bundle and maintenance overhead; only needed if hosting live full-stack AI apps inside the same repo.
- **No-code (Framer / Webflow / Substack)**: faster initial setup, but less design control and recurring cost as the site grows.

## Consequences

- Interactive AI tools or live demos that require a backend must be hosted separately and linked from their **Prototype** page.
- Email capture for **Subscribers** will use an external form/newsletter provider rather than a custom backend database.
