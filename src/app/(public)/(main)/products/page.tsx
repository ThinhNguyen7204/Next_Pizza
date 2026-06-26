import type { Metadata } from 'next'
import ProductsClient from './ProductsClient'
import productApiRequest from '@/apiRequests/product'

export const metadata: Metadata = {
  title: 'Thực đơn món ăn',
  description: 'Khám phá thực đơn Pizza thủ công chuẩn vị Naples của La Pizzaia. Bột bánh ủ chậm 72 giờ, nướng củi ở nhiệt độ 450°C trong 90 giây. Đặt món giao tận nơi tiện lợi.',
  openGraph: {
    title: 'Thực đơn món ăn | La Pizzaia',
    description: 'Khám phá thực đơn Pizza thủ công chuẩn vị Naples của La Pizzaia. Bột bánh ủ chậm 72 giờ, nướng củi ở nhiệt độ 450°C trong 90 giây.',
    url: '/products',
  },
}

export default async function ProductsPage() {
  let products: any[] = []
  try {
    const res = await productApiRequest.list()
    products = res.payload?.data || []
  } catch (error) {
    console.error('Failed to fetch product list for JSON-LD structured data', error)
  }

  const activeProducts = products.filter((p: any) => p.status === 'Available')

  // Generate Menu & MenuItem JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    'name': 'Thực đơn La Pizzaia',
    'description': 'Thực đơn Pizza thủ công nghệ nhân và các món ăn Ý tại La Pizzaia Pizzeria.',
    'servesCuisine': 'Italian, Pizza',
    'hasMenuSection': Array.from(new Set(activeProducts.map((p) => p.menu_name || 'Pizza'))).map((menuName) => {
      const sectionProducts = activeProducts.filter((p) => (p.menu_name || 'Pizza') === menuName)
      return {
        '@type': 'MenuSection',
        'name': menuName,
        'hasMenuItem': sectionProducts.map((product) => ({
          '@type': 'MenuItem',
          'name': product.product_name,
          'description': product.description || `Món ngon ${product.product_name} tại La Pizzaia.`,
          'offers': {
            '@type': 'Offer',
            'price': product.price,
            'priceCurrency': 'VND'
          },
          'image': product.image || undefined
        }))
      }
    })
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductsClient />
    </>
  )
}