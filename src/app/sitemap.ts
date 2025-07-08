import type { MetadataRoute } from 'next';

const loanServices = ['home-loan', 'personal-loan', 'business-loan', 'credit-card', 'machinery-loan'];
const caServices = ['gst-service', 'itr-filing', 'accounting-bookkeeping', 'company-incorporation', 'financial-advisory', 'audit-assurance'];
const govSchemes = ['pm-mudra-yojana', 'pmegp-khadi-board', 'stand-up-india', 'other'];


export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rnfintech.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/partner-login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/partner-signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/services/loans`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/ca-services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/government-schemes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ];

  const loanPages = loanServices.map(loan => ({
    url: `${baseUrl}/apply/${loan}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const caPages = caServices.map(service => ({
    url: `${baseUrl}/apply/${service}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  
  const govSchemePages = govSchemes.map(scheme => ({
      url: `${baseUrl}/apply/government-scheme/${scheme}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
  }));

  return [...staticPages, ...loanPages, ...caPages, ...govSchemePages];
}
