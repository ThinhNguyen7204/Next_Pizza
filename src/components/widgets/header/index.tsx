"use client"

import Logo from "@/components/logo"
import { NAV_LINKS } from "@/config/constant"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, useCartStore } from "@/store"
import { ShoppingBag, Menu, X, LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";
import { useRef, useState } from "react"


export default function Header() {
  const pathname = usePathname()
  const { items, toggleCart } = useCartStore()
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const isSolid = 1

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isSolid
        ? "bg-cream/95 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)]"
        : "bg-transparent"
        }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Logo href="/" size="lg" />

        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const active = link.href === pathname
            return (
              <li key={link.href} className="relative">
                <Link href={link.href} className={`font-sans text-xs tracking-[0.2em] uppercase transition-colors ${active
                  ? "text-primary"
                  : "text-charcoal/70 hover:text-charcoal"
                  }`}>
                  {link.label}
                </Link>
                {active && (
                  <motion.span
                    layoutId="header-active"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                  />
                )}
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleCart}
            className="relative text-charcoal/70 hover:text-primary transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-dark text-[10px] font-bold flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>

          {totalItems ? (
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex items-center gap-2 text-charcoal/70 hover:text-charcoal transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="font-sans text-xs tracking-widest uppercase">{user?.username}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-white/95 backdrop-blur-3xl border border-charcoal/5 rounded-4xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden p-1.5 ring-1 ring-charcoal/5"
                  >
                    {/* User Info Section */}
                    <div className="px-4 py-4 mb-1.5 bg-charcoal/2 rounded-xl border border-charcoal/3">
                      <p className="font-sans text-[10px] text-charcoal/40 tracking-[0.2em] font-semibold uppercase mb-1">Account</p>
                      <p className="font-serif text-charcoal leading-tight truncate">{user?.username || 'User'}</p>
                      <p className="font-sans text-xs text-charcoal/50 truncate mt-0.5">{user?.email}</p>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-sans text-charcoal/70 hover:text-charcoal hover:bg-charcoal/4 rounded-lg transition-all duration-200 group"
                      >
                        <User className="w-4.5 h-4.5 text-charcoal/40 group-hover:text-charcoal/80 transition-colors" />
                        <span className="font-medium">Profile Settings</span>
                      </Link>

                      {user?.role !== "Customer" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-sans text-charcoal hover:bg-primary/5 rounded-lg transition-all duration-200 group"
                        >
                          <LayoutDashboard className="w-4.5 h-4.5 te4.5d/70 group-hover:text-primary transition-colors" />
                          <span className="font-medium text-primary">Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="h-px bg-charcoal/5 my-1.5 mx-2" />

                    {/* Logout Section */}
                    <button
                      // onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-sans text-red-600/80 hover:text-red-500 hover:bg-red-50/80 rounded-lg transition-all duration-200 group"
                    >
                      <LogOut className="w-4.5 h-4.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-block font-sans text-xs tracking-widest uppercase text-charcoal/70 hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

      </nav>
    </header>
  )
}