import type { Metadata } from 'next'
import EventsClient from './EventsClient'

export const metadata: Metadata = {
  title: 'Sự kiện nổi bật',
  description: 'Tham gia các sự kiện ẩm thực đặc biệt tại La Pizzaia: Lớp học làm Pizza thủ công, Đêm tiệc kết hợp Rượu vang & Pizza, Khai mạc mùa Nấm Truffle. Đặt chỗ ngay hôm nay.',
  openGraph: {
    title: 'Sự kiện nổi bật | La Pizzaia',
    description: 'Tham gia các sự kiện ẩm thực đặc biệt tại La Pizzaia: Lớp học làm Pizza thủ công, Đêm tiệc kết hợp Rượu vang & Pizza, Khai mạc mùa Nấm Truffle.',
    url: '/events',
  },
}

export default function EventsPage() {
  return <EventsClient />
}
