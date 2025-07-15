import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rnfintech.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
            '/',
            '/about',
            '/contact',
            '/privacy-policy',
            '/terms-of-service',
            '/services/',
            '/apply/',
        ],
        disallow: [
            '/admin/',
            '/dashboard/',
            '/profile/',
            '/login',
            '/signup',
            '/partner-login',
            '/partner-signup',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
