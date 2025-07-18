
"use client"

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from "react"

const pageview = (GA_MEASUREMENT_ID: string, url: string) => {
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const GoogleAnalytics = ({ gaId }: { gaId?: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId) {
      return;
    }
    const url = pathname + searchParams.toString();
    pageview(gaId, url);
  }, [pathname, searchParams, gaId]);


  if (!gaId) {
    console.warn("Google Analytics ID is not set. Analytics will be disabled.");
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  )
}
