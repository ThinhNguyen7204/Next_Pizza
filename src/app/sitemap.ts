import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const routes = ['', '/about', '/contact', '/events', '/products']

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/products' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/products' ? 0.9 : 0.8,
  }))
}
