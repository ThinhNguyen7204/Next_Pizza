'use client'

import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-charcoal text-cream border-t border-cream/10 pt-16 pb-8 font-sans transition-colors duration-300 dark:bg-black'>
      <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>

        {/* Column 1: Brand & Bio */}
        <div className='space-y-6'>
          <div className='flex items-center space-x-2'>
            <Logo href="/" size="md" variant="light" />
          </div>
          <p className='text-sm text-cream/70 font-light leading-relaxed'>
            Trải nghiệm tinh hoa ẩm thực Ý với những chiếc bánh Pizza nướng củi thủ công chuẩn vị truyền thống Naples.
            Mỗi nguyên liệu đều được chọn lọc tỉ mỉ để tạo nên hương vị hoàn hảo nhất.
          </p>
          <div className='flex space-x-4 pt-2'>
            <Link
              href='https://facebook.com'
              target='_blank'
              className='p-2.5 rounded-full bg-cream/5 text-cream/75 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300'
            >
              <Facebook className='w-4 h-4' />
            </Link>
            <Link
              href='https://instagram.com'
              target='_blank'
              className='p-2.5 rounded-full bg-cream/5 text-cream/75 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300'
            >
              <Instagram className='w-4 h-4' />
            </Link>
            <Link
              href='https://twitter.com'
              target='_blank'
              className='p-2.5 rounded-full bg-cream/5 text-cream/75 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300'
            >
              <Twitter className='w-4 h-4' />
            </Link>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className='space-y-6'>
          <h4 className='font-serif text-xl font-semibold tracking-wide border-b border-cream/10 pb-2 w-fit pr-8'>
            Khám phá Menu
          </h4>
          <ul className='space-y-3 text-sm text-cream/70 font-light'>
            <li>
              <Link href='/products' className='hover:text-primary hover:pl-2 transition-all duration-300 flex items-center gap-1 group'>
                <span>Thực đơn Pizza</span>
                <ArrowUpRight className='w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity' />
              </Link>
            </li>
            <li>
              <Link href='/products' className='hover:text-primary hover:pl-2 transition-all duration-300 flex items-center gap-1 group'>
                <span>Đồ uống giải nhiệt</span>
                <ArrowUpRight className='w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity' />
              </Link>
            </li>
            <li>
              <Link href='/products' className='hover:text-primary hover:pl-2 transition-all duration-300 flex items-center gap-1 group'>
                <span>Món phụ & Tráng miệng</span>
                <ArrowUpRight className='w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity' />
              </Link>
            </li>
            <li>
              <Link href='/checkout' className='hover:text-primary hover:pl-2 transition-all duration-300 flex items-center gap-1 group'>
                <span>Giỏ hàng & Thanh toán</span>
                <ArrowUpRight className='w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity' />
              </Link>
            </li>
            <li>
              <Link href='/contact' className='hover:text-primary hover:pl-2 transition-all duration-300 flex items-center gap-1 group'>
                <span>Liên hệ & Hỗ trợ</span>
                <ArrowUpRight className='w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity' />
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Info */}
        <div className='space-y-6'>
          <h4 className='font-serif text-xl font-semibold tracking-wide border-b border-cream/10 pb-2 w-fit pr-8'>
            Thông tin liên hệ
          </h4>
          <ul className='space-y-4 text-sm text-cream/70 font-light'>
            <li className='flex items-start space-x-3'>
              <MapPin className='w-5 h-5 text-primary shrink-0 mt-0.5' />
              <span>123 Đường Hải Sản, Quận 1, TP. Hồ Chí Minh</span>
            </li>
            <li className='flex items-center space-x-3'>
              <Phone className='w-5 h-5 text-primary shrink-0' />
              <span>+84 901 234 567</span>
            </li>
            <li className='flex items-center space-x-3'>
              <Mail className='w-5 h-5 text-primary shrink-0' />
              <span>contact@lapizzaia.vn</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Opening Hours & Newsletter */}
        <div className='space-y-6'>
          <h4 className='font-serif text-xl font-semibold tracking-wide border-b border-cream/10 pb-2 w-fit pr-8'>
            Giờ mở cửa
          </h4>
          <div className='flex items-start space-x-3 text-sm text-cream/70 font-light mb-4'>
            <Clock className='w-5 h-5 text-primary shrink-0 mt-0.5' />
            <div>
              <p className='font-medium text-cream'>Thứ Hai - Chủ Nhật</p>
              <p className='text-xs'>10:00 AM - 11:00 PM</p>
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-xs text-cream/60 font-light'>Đăng ký nhận ưu đãi & tin tức mới nhất:</p>
            <div className='flex rounded-xl overflow-hidden border border-cream/15 focus-within:border-primary transition-colors'>
              <input
                type='email'
                placeholder='Email của bạn...'
                className='w-full px-4 py-2 bg-cream/5 text-white placeholder-cream/40 text-sm outline-none border-none'
              />
              <button className='bg-primary hover:bg-primary/95 text-white px-4 py-2 text-sm font-semibold transition-colors'>
                Gửi
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Copyright bar */}
      <div className='max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between text-xs text-cream/50 font-light gap-4'>
        <p>&copy; {currentYear} La Pizzaia Restaurant. All rights reserved.</p>
        <div className='flex space-x-6'>
          <Link href='#' className='hover:text-primary transition-colors'>Chính sách bảo mật</Link>
          <Link href='#' className='hover:text-primary transition-colors'>Điều khoản dịch vụ</Link>
          <Link href='#' className='hover:text-primary transition-colors'>Chính sách giao hàng</Link>
        </div>
      </div>
    </footer>
  )
}