'use client'
import Logo from "@/components/logo";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-10"
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-charcoal/40 hover:text-charcoal font-sans text-xs tracking-widest uppercase transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Sign In
          </Link>
          <div className="space-y-6">
            <Logo href="/" size="lg" />
            <div>
              <h1 className="font-serif text-4xl md:text-5xl">
                Reset your <span className="cursive text-primary italic">password</span>
              </h1>
              <p className="font-sans text-charcoal/50 font-light mt-3 max-w-md">
                No worries — enter your email below and we&apos;ll send you a secure link to reset your password.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl border border-charcoal/10 p-10 text-center space-x-6"
              >
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl">Check Your Inbox</h2>
                  <p className="font-sans text-sm text-charcoal/60 max-w-xs mx-auto">
                    We&apos;ve sent a password reset link to{" "}
                    <strong className="text-charcoal">{email}</strong>. Follow the instructions to create a new password.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="tech-label block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hello@lapizzaia.com"
                        required
                        className="w-full pl-11 pr-4 py-4 bg-white border border-charcoal/15 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-charcoal text-cream py-4 rounded-xl font-sans text-sm tracking-widest uppercase hover:bg-primary transition-colors duration-300 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}