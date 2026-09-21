import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://khcrf.org';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // In a full implementation, you would fetch dynamic CanonicalEntities here
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entities?limit=1000`);
  // const entities = await res.json();
  // const dynamicRoutes = entities.data.map(entity => ({
  //   url: `${baseUrl}/entity/${entity.slug}`,
  //   lastModified: new Date(entity.updatedAt),
  //   changeFrequency: 'weekly',
  //   priority: 0.7,
  // }));
  
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  return [...staticRoutes, ...dynamicRoutes];
}
