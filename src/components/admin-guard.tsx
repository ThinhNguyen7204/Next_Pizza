'use client'

import { useAppStore } from '@/components/app-provider'
import { Role } from '@/constants/type'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const role = useAppStore((state) => state.role)
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()

    // If an access token exists but the role hasn't hydrated/loaded in state yet, wait.
    if (accessToken && !role) {
      return
    }

    if (role === Role.Customer) {
      router.push('/')
    } else if (!role && !accessToken) {
      router.push('/login')
    } else {
      setIsAuthorized(true)
    }
  }, [role, router])

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
