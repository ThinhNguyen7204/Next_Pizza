import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Liên hệ & Hỗ trợ',
  description: 'Liên hệ với nhà hàng La Pizzaia. Gửi góp ý, phản hồi, thắc mắc về chất lượng món ăn, dịch vụ giao hàng hoặc đặt bàn. Chúng tôi hỗ trợ 24/7.',
  openGraph: {
    title: 'Liên hệ & Hỗ trợ | La Pizzaia',
    description: 'Liên hệ với nhà hàng La Pizzaia. Gửi góp ý, phản hồi, thắc mắc về chất lượng món ăn, dịch vụ giao hàng hoặc đặt bàn. Chúng tôi hỗ trợ 24/7.',
    url: '/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
