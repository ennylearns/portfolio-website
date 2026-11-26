const buttondownUsername =
  import.meta.env.PUBLIC_BUTTONDOWN_USERNAME || 'eniolaodunaiya';

export const siteConfig = {
  siteUrl: 'https://eniolaodunaiya.com',
  authorName: 'Eniola Odunaiya',
  title: 'Eniola Odunaiya — Practical AI for Nigeria & Africa',
  description:
    'Practical AI for daily life, small businesses, and the economy in Nigeria and across Africa. Prototypes, Playbooks, and Essays by Eniola Odunaiya.',
  social: {
    x: 'https://x.com/eniolaodunaiya',
    linkedin: 'https://www.linkedin.com/in/eniolaodunaiya',
    github: 'https://github.com/eniolaodunaiya',
    email: 'hello@eniolaodunaiya.com',
  },
  buttondown: {
    username: buttondownUsername,
    actionUrl: `https://buttondown.com/api/emails/embed-subscribe/${buttondownUsername}`,
  },
} as const;

export interface SocialLink {
  label: string;
  href: string;
  external: boolean;
}

export function getSocialLinks(
  options: { showEmailAddress?: boolean } = {},
): SocialLink[] {
  const { showEmailAddress = false } = options;
  return [
    { label: 'X / Twitter', href: siteConfig.social.x, external: true },
    { label: 'LinkedIn', href: siteConfig.social.linkedin, external: true },
    { label: 'GitHub', href: siteConfig.social.github, external: true },
    {
      label: showEmailAddress ? `Email (${siteConfig.social.email})` : 'Email',
      href: `mailto:${siteConfig.social.email}`,
      external: false,
    },
  ];
}
