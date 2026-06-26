import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'La Pizzaia - Artisan Pizzeria & Italian Fine Dining',
  description: 'Trải nghiệm tinh hoa ẩm thực Ý với những chiếc bánh Pizza nướng củi thủ công chuẩn vị truyền thống Naples tại La Pizzaia. Bột ủ chậm 72 giờ, nguyên liệu nhập khẩu thượng hạng.',
  openGraph: {
    title: 'La Pizzaia - Artisan Pizzeria & Italian Fine Dining',
    description: 'Trải nghiệm tinh hoa ẩm thực Ý với những chiếc bánh Pizza nướng củi thủ công chuẩn vị truyền thống Naples tại La Pizzaia.',
    url: '/',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000',
        width: 1000,
        height: 1000,
        alt: 'Truffle Symphony Pizza - La Pizzaia',
      },
    ],
  },
}

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    'name': 'La Pizzaia',
    'image': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000',
    '@id': `${baseUrl}/#restaurant`,
    'url': baseUrl,
    'telephone': '+84281234567',
    'priceRange': '150.000đ - 500.000đ',
    'menu': `${baseUrl}/products`,
    'servesCuisine': 'Italian, Pizza',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Đường Quận 1',
      'addressLocality': 'Thành phố Hồ Chí Minh',
      'addressRegion': 'Hồ Chí Minh',
      'addressCountry': 'VN'
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        'opens': '10:00',
        'closes': '22:00'
      }
    ]
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  )
}