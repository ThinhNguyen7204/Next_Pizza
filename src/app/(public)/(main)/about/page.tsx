import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'Giới thiệu về chúng tôi',
  description: 'Hành trình phát triển và triết lý ẩm thực tại nhà hàng La Pizzaia. Từ một căn bếp nhỏ đến điểm hẹn pizza thủ công chuẩn vị Naples hàng đầu Sài Gòn.',
  openGraph: {
    title: 'Giới thiệu về chúng tôi | La Pizzaia',
    description: 'Hành trình phát triển và triết lý ẩm thực tại nhà hàng La Pizzaia. Từ một căn bếp nhỏ đến điểm hẹn pizza thủ công chuẩn vị Naples hàng đầu Sài Gòn.',
    url: '/about',
  },
}

export default function AboutPage() {
  return <AboutClient />
}
