import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://rnfintech.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
            '/admin/',
            '/dashboard/',
            '/profile',
            '/apply/',
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
