export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  author: string;
  url: string;
  ogImage: string;
  twitterHandle: string;

  // Theme settings
  theme: {
    accentColor: string;
    defaultColorMode: 'light' | 'dark' | 'system';
    showThemeToggle: boolean;
  };

  // Navigation
  nav: {
    main: Array<{
      name: string;
      href: string;
    }>;
  };

  // Features toggle
  features: {
    blog: boolean;
    portfolio: boolean;
    landing: boolean;
    rss: boolean;
    sitemap: boolean;
    search: boolean;
  };

  // Social links
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };

  // Blog settings
  blog: {
    postsPerPage: number;
    showToc: boolean;
    showReadingTime: boolean;
    showShareButtons: boolean;
    showRelatedPosts: boolean;
  };

  // Portfolio settings
  portfolio: {
    projectsPerPage: number;
    showTechStack: boolean;
    showYear: boolean;
  };
}

const siteConfig: SiteConfig = {
  name: 'Astro Haze',
  title: 'Astro Haze - Glassmorphism Theme',
  description: 'A beautiful glassmorphism multi-purpose theme for Astro 7',
  author: 'Your Name',
  url: 'https://kpab.github.io/astro-haze',
  ogImage: '/og-image.png',
  twitterHandle: '@yourusername',

  theme: {
    accentColor: 'hsl(280, 70%, 60%)',
    defaultColorMode: 'system',
    showThemeToggle: true
  },

  nav: {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: 'Portfolio', href: '/work' },
      { name: 'Landing', href: '/landing' },
      { name: 'About', href: '/about' }
    ]
  },

  features: {
    blog: true,
    portfolio: true,
    landing: true,
    rss: true,
    sitemap: true,
    search: true
  },

  social: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername'
  },

  blog: {
    postsPerPage: 6,
    showToc: true,
    showReadingTime: true,
    showShareButtons: true,
    showRelatedPosts: true
  },

  portfolio: {
    projectsPerPage: 9,
    showTechStack: true,
    showYear: true
  }
};

export default siteConfig;