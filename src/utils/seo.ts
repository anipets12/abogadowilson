// Definición de la interfaz SEOProps
export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export const updateMetaTags = ({
  title,
  description,
  image = '/logo.png',
  url = window.location.href
}: SEOProps) => {
  document.title = `${title} | Abogado Wilson`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
};

export const initializeAnalytics = () => {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${
    (typeof process !== 'undefined' ? process.env?.VITE_GOOGLE_ANALYTICS_ID : 
    (typeof window !== 'undefined' ? window.__ENV__?.VITE_GOOGLE_ANALYTICS_ID : 'G-DEFAULT'))
  }`;
  script.async = true;
  document.head.appendChild(script);
};
