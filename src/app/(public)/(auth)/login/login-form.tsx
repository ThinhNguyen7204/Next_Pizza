'use client'

import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from "@/components/logo"
import Link from "next/link"
import { useLoginMutation } from "@/queries/useAuth"
import { useAuthStore } from "@/store"
import { useAppStore } from "@/components/app-provider"
import { generateSocketInstace, handleErrorApi } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const router = useRouter();

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const isLoading = loginMutation.isPending;

  async function onSubmit(data: LoginBodyType) {
    if (isLoading) return;
    try {
      const result = await loginMutation.mutateAsync(data);
      toast.success(result.payload.message || "Đăng nhập thành công!");
      
      const { account, accessToken, refreshToken } = result.payload.data;
      setAuth(account, accessToken, refreshToken);
      setRole(account.role);
      setSocket(generateSocketInstace(accessToken));
      
      router.push("/manage/dashboard");
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-10">
          <div className="space-y-3">
            <div className="lg:hidden flex justify-center mb-4">
              <Logo href="/" size="lg" />
            </div>
            <h1 className="font-serif text-5xl text-black">Welcome <span className="cursive text-primary italic">back</span></h1>
            <p className="font-sans text-charcoal/50 font-light">
              Sign in to your account to continue your order.
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 max-w-sm mx-auto w-full"
            noValidate
          >
            <div className="space-y-2">
              <label className="tech-label block text-charcoal/50">Email</label>
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          type="email"
                          placeholder="hello@lapizzaia.com"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                          className={`
                            w-full pl-11 pr-4 py-6 bg-white!
                            border rounded-xl font-sans text-sm
                            transition-all text-black

                            focus:outline-none
                            focus:ring-2 focus:ring-gold/30
                            focus:border-gold

                            ${fieldState.invalid
                              ? "border-red-400 focus:ring-red-300"
                              : "border-charcoal/15"
                            }
                          `}
                        />


                      </>
                    )}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="tech-label block text-charcoal/50">Password</label>

              <div>
                <div className="relative">
                  <Lock
                    className="
                      absolute left-4 top-1/2 -translate-y-1/2
                      w-4 h-4 text-charcoal/40
                      pointer-events-none
                    "
                  />
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                        className={`
                          w-full pl-11 pr-11 py-6 bg-white!
                          border rounded-xl font-sans text-sm
                          transition-all text-black

                          focus:outline-none
                          focus:ring-2 focus:ring-gold/30
                          focus:border-gold

                          ${fieldState.invalid
                            ? "border-red-400 focus:ring-red-300"
                            : "border-charcoal/15"
                          }
                        `}
                      />
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute right-4 top-1/2 -translate-y-1/2
                      text-charcoal/40 hover:text-charcoal
                      transition-colors
                    "
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {form.formState.errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="tech-label text-primary hover:text-charcoal transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full flex items-center justify-center gap-3
                bg-charcoal text-cream
                py-4 rounded-xl
                font-sans text-sm tracking-widest uppercase

                hover:bg-primary
                transition-colors duration-300

                disabled:opacity-60
              "
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-charcoal/10" /></div>
            <div className="relative flex justify-center"><span className="bg-cream px-4 text-xs uppercase tracking-widest text-charcoal/30 font-sans">or</span></div>
          </div>

          <p className="text-center font-sans text-sm text-charcoal/60">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-charcoal transition-colors font-medium">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}