import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Schema Markup Validator - JSON-LD & Schema.org Validator Tool',
    short_name: 'Schema Markup Validator',
    description:
      'Free schema markup validator for JSON-LD and Schema.org structured data. Validate schema markup for Google Rich Results compliance. Online validator tool for SEO professionals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a', // slate-900
    icons: [
      {
        src: '/favicons/favicon-36x36.png',
        sizes: '36x36',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicons/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicons/favicon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicons/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicons/favicon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicons/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicons/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['productivity', 'utilities', 'developer-tools'],
  };
}
