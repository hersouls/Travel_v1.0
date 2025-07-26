import type { Metadata } from 'next';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

const defaultConfig = {
  siteName: 'Moonwave Travel',
  domain: 'https://travel.moonwave.kr',
  defaultImage: '/og-default.png',
  defaultDescription: '협업 기반의 스마트 여행 계획 시스템 - 친구들과 함께 여행을 계획하고 공유하세요',
  keywords: [
    '여행계획', '여행일정', '여행플래너', '여행공유',
    '협업여행', '여행지추천', '여행앱', '여행관리',
    'travel planning', 'itinerary', 'travel app', 'collaboration'
  ],
};

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title = '스마트 여행 계획',
    description = defaultConfig.defaultDescription,
    keywords = defaultConfig.keywords,
    image = defaultConfig.defaultImage,
    url = '',
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
  } = config;

  const fullTitle = title === defaultConfig.siteName 
    ? title 
    : `${title} | ${defaultConfig.siteName}`;
    
  const fullUrl = `${defaultConfig.domain}${url}`;
  const fullImage = image.startsWith('http') ? image : `${defaultConfig.domain}${image}`;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: author ? [{ name: author }] : [{ name: 'Moonwave Team' }],
    creator: 'Moonwave',
    publisher: 'Moonwave',
    
    metadataBase: new URL(defaultConfig.domain),
    alternates: {
      canonical: fullUrl,
      languages: {
        'ko': fullUrl,
        'en': fullUrl.replace('/ko/', '/en/'),
      },
    },

    openGraph: {
      type,
      locale: 'ko_KR',
      url: fullUrl,
      siteName: defaultConfig.siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : ['Moonwave Team'],
        section,
      }),
    },

    twitter: {
      card: 'summary_large_image',
      site: '@moonwave_travel',
      creator: '@moonwave_travel',
      title: fullTitle,
      description,
      images: [fullImage],
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },

    category: 'Travel & Tourism',
  };
}

// 구조화된 데이터 (JSON-LD) 생성
export function generateStructuredData(
  type: 'WebSite' | 'WebApplication' | 'TravelAction' | 'Organization', 
  data: { 
    userName?: string; 
    tripName?: string; 
    tripDescription?: string; 
    destinations?: string[] 
  } = {}
) {
  const baseUrl = defaultConfig.domain;

  switch (type) {
    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: defaultConfig.siteName,
        description: defaultConfig.defaultDescription,
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        sameAs: [
          'https://facebook.com/moonwave.travel',
          'https://instagram.com/moonwave.travel',
          'https://twitter.com/moonwave_travel',
        ],
      };

    case 'WebApplication':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: defaultConfig.siteName,
        description: defaultConfig.defaultDescription,
        url: baseUrl,
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0.0',
        author: {
          '@type': 'Organization',
          name: 'Moonwave',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '150',
          bestRating: '5',
          worstRating: '1',
        },
      };

    case 'TravelAction':
      return {
        '@context': 'https://schema.org',
        '@type': 'PlanAction',
        name: '여행 계획 만들기',
        description: '친구들과 함께 여행 일정을 계획하고 공유하세요',
        actionStatus: 'PotentialActionStatus',
        agent: {
          '@type': 'Person',
          name: data.userName || '사용자',
        },
        object: {
          '@type': 'Trip',
          name: data.tripName || '새로운 여행',
          description: data.tripDescription,
          touristDestination: data.destinations || [],
        },
        result: {
          '@type': 'TravelItinerary',
          name: `${data.tripName} 일정표`,
        },
      };

    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Moonwave',
        description: '혁신적인 여행 기술을 개발하는 회사',
        url: 'https://moonwave.kr',
        logo: `${baseUrl}/logo.png`,
        sameAs: [
          'https://facebook.com/moonwave',
          'https://instagram.com/moonwave',
          'https://twitter.com/moonwave',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+82-2-1234-5678',
          contactType: 'Customer Service',
          availableLanguage: ['Korean', 'English'],
        },
      };

    default:
      return null;
  }
}

// Sitemap 생성용 유틸리티
export function generateSitemapEntries() {
  const baseUrl = defaultConfig.domain;
  const currentDate = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/travels`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/travels/new`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];
}

// 페이지별 SEO 설정 프리셋
export const seoPresets: Record<string, SEOConfig> = {
  home: {
    title: '스마트 여행 계획 | Moonwave Travel',
    description: '친구들과 함께 여행을 계획하고 공유하세요. 실시간 협업, 지도 통합, 일정 관리 등 모든 기능을 제공합니다.',
    keywords: ['여행계획', '여행일정', '협업여행', '여행플래너', '여행앱'],
    image: '/og-home.png',
  },
  
  travels: {
    title: '내 여행 목록',
    description: '저장된 여행 계획들을 확인하고 관리하세요. 과거 여행부터 예정된 여행까지 한눈에 볼 수 있습니다.',
    keywords: ['여행목록', '여행관리', '여행히스토리'],
    image: '/og-travels.png',
  },
  
  newTravel: {
    title: '새 여행 계획',
    description: '새로운 여행을 계획해보세요. 목적지 선택부터 세부 일정까지 쉽고 빠르게 만들 수 있습니다.',
    keywords: ['새여행', '여행만들기', '여행계획하기'],
    image: '/og-new-travel.png',
  },
  
  map: {
    title: '여행지 지도',
    description: '지도에서 여행 계획을 확인하고 최적의 경로를 찾아보세요.',
    keywords: ['여행지도', '여행경로', '관광지찾기'],
    image: '/og-map.png',
  },
  };

// robots.txt 생성
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# 중요한 페이지들 우선순위 설정
Allow: /travels
Allow: /map
Allow: /travels/new

# 동적 페이지 허용
Allow: /travels/*

# 시스템 파일들 차단
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# 사이트맵 위치
Sitemap: ${defaultConfig.domain}/sitemap.xml

# 크롤링 속도 제한
Crawl-delay: 1`;
}