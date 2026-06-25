'use client'

import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import UpdateProfileForm from '@/app/manage/setting/update-profile-form'
import ChangePasswordForm from '@/app/manage/setting/change-password-form'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-cream dark:bg-background font-sans">
      {/* Header */}
      <section className="pt-32 pb-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto space-y-3"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <User className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-serif text-4xl text-charcoal dark:text-cream">
            Tài khoản của <span className="text-primary italic">tôi</span>
          </h1>
          <p className="text-sm text-charcoal/50 dark:text-cream/50 font-light">
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <UpdateProfileForm />
          <ChangePasswordForm />
        </motion.div>
      </section>
    </div>
  )
}
