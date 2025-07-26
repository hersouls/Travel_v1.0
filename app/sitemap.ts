import { MetadataRoute } from 'next';
import { generateSitemapEntries } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = generateSitemapEntries();
  
  // 여기에 동적 여행 페이지들을 추가할 수 있습니다
  // const dynamicTravelEntries = await getDynamicTravelPages();
  
  return staticEntries;
}