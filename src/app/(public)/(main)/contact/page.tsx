'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store'
import { toast } from 'sonner'
import { useCreateSupportMutation, useGetMySupports } from '@/queries/useSupport'
import {
  Send,
  MessageCircle,
  ClipboardList,
  User,
  Mail,
  Phone,
  ChevronDown,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  MessagesSquare,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface SupportReply {
  sender: 'Admin' | 'Customer'
  content: string
  timestamp: string
}

interface SupportMessage {
  id: string
  name: string
  email: string
  phone: string
  category: string
  message: string
  date: string
  createdAt?: string
  status: 'Pending' | 'Processing' | 'Resolved'
  replies?: SupportReply[]
}

const CATEGORIES = [
  'Chất lượng món ăn',
  'Giao hàng & Vận chuyển',
  'Đặt bàn & Sự kiện',
  'Voucher & Ưu đãi',
  'Đơn hàng & Thanh toán',
  'Khác',
]

const STATUS_CONFIG = {
  Pending: {
    label: 'Chờ xử lý',
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40',
    icon: Clock,
  },
  Processing: {
    label: 'Đang xử lý',
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/40',
    icon: Loader2,
  },
  Resolved: {
    label: 'Đã phản hồi',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40',
    icon: CheckCircle2,
  },
}

const STORAGE_KEY = 'la_pizzaia_supports'

function generateId(): string {
  return 'SUP_' + Date.now().toString(36).toUpperCase()
}

function loadSupports(): SupportMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveSupports(list: SupportMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// ─── Tab: Submit Form ─────────────────────────────────────────────────────────
function SubmitForm({ userEmail, userName }: { userEmail?: string; userName?: string }) {
  const [form, setForm] = useState({
    name: userName || '',
    email: userEmail || '',
    phone: '',
    category: CATEGORIES[0],
    message: '',
  })
  const createSupportMutation = useCreateSupportMutation()
  const [submitted, setSubmitted] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  const loading = createSupportMutation.isPending

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      name: userName || prev.name,
      email: userEmail || prev.email,
    }))
  }, [userEmail, userName])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }
    try {
      await createSupportMutation.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        category: form.category,
        message: form.message.trim(),
      })
      setSubmitted(true)
      toast.success('Yêu cầu hỗ trợ đã được gửi thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi yêu cầu hỗ trợ.')
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setForm({ name: userName || '', email: userEmail || '', phone: '', category: CATEGORIES[0], message: '' })
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-charcoal dark:text-cream">Gửi thành công!</h3>
          <p className="text-sm text-charcoal/60 dark:text-cream/60 max-w-sm">
            Chúng tôi đã nhận được phản hồi của bạn và sẽ phản hồi trong vòng <strong>24 giờ</strong>.
          </p>
        </div>
        <p className="text-xs text-charcoal/40 dark:text-cream/40">
          Bạn có thể theo dõi trạng thái xử lý tại tab{' '}
          <strong className="text-primary">"Phiếu của tôi"</strong>
        </p>
        <button
          onClick={handleReset}
          className="mt-2 inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-primary hover:text-charcoal dark:hover:text-cream transition-colors border-b border-primary/30 pb-0.5"
        >
          Gửi thêm yêu cầu <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 dark:text-cream/50">
            Họ và tên <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 dark:text-cream/30 pointer-events-none" />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-cream/10 rounded-xl text-sm font-sans text-charcoal dark:text-cream placeholder:text-charcoal/30 dark:placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 dark:text-cream/50">
            Email <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 dark:text-cream/30 pointer-events-none" />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-cream/10 rounded-xl text-sm font-sans text-charcoal dark:text-cream placeholder:text-charcoal/30 dark:placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Phone + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 dark:text-cream/50">
            Số điện thoại
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 dark:text-cream/30 pointer-events-none" />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0901 234 567"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-cream/10 rounded-xl text-sm font-sans text-charcoal dark:text-cream placeholder:text-charcoal/30 dark:placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 dark:text-cream/50">
            Loại góp ý
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryOpen(p => !p)}
              className="w-full flex items-center justify-between pl-4 pr-3 py-3 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-cream/10 rounded-xl text-sm font-sans text-charcoal dark:text-cream focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              <span>{form.category}</span>
              <ChevronDown className={`w-4 h-4 text-charcoal/40 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {categoryOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-charcoal/10 dark:border-cream/10 rounded-xl shadow-lg overflow-hidden"
                >
                  {CATEGORIES.map(cat => (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => { setForm(p => ({ ...p, category: cat })); setCategoryOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-sans transition-colors ${form.category === cat
                          ? 'text-primary bg-primary/5'
                          : 'text-charcoal/70 dark:text-cream/70 hover:bg-charcoal/3 dark:hover:bg-cream/5 hover:text-charcoal dark:hover:text-cream'
                          }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 dark:text-cream/50">
          Nội dung <span className="text-primary">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Mô tả chi tiết ý kiến, góp ý hoặc vấn đề bạn gặp phải..."
          required
          rows={5}
          className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-cream/10 rounded-xl text-sm font-sans text-charcoal dark:text-cream placeholder:text-charcoal/30 dark:placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-charcoal dark:bg-cream text-cream dark:text-charcoal py-4 rounded-xl font-sans text-sm tracking-widest uppercase hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Đang gửi...</>
        ) : (
          <><Send className="w-4 h-4" /> Gửi yêu cầu</>
        )}
      </button>
    </motion.form>
  )
}

// ─── Tab: My Tickets ──────────────────────────────────────────────────────────
function MyTickets({ userEmail }: { userEmail?: string }) {
  const [email, setEmail] = useState(userEmail || '')
  const [searchEmail, setSearchEmail] = useState(userEmail || '')
  const [searched, setSearched] = useState(!!userEmail)
  const [selected, setSelected] = useState<SupportMessage | null>(null)

  const { data: mySupportsRes } = useGetMySupports(searchEmail, searched)
  const tickets = (mySupportsRes?.payload?.data || []) as SupportMessage[]

  const doSearch = () => {
    if (!email.trim()) { toast.error('Vui lòng nhập email của bạn.'); return }
    setSearchEmail(email.trim())
    setSearched(true)
  }

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail)
      setSearchEmail(userEmail)
      setSearched(true)
    }
  }, [userEmail])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Email search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 dark:text-cream/30 pointer-events-none" />
          <input
            value={email}
            onChange={e => { setEmail(e.target.value); setSearched(false) }}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
            placeholder="Nhập email bạn đã dùng để gửi yêu cầu..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-charcoal/10 dark:border-cream/10 rounded-xl text-sm font-sans text-charcoal dark:text-cream placeholder:text-charcoal/30 dark:placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <button
          onClick={doSearch}
          className="px-5 py-3 bg-charcoal dark:bg-cream text-cream dark:text-charcoal rounded-xl font-sans text-xs tracking-widest uppercase hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all duration-300"
        >
          Tìm
        </button>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {searched && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-charcoal/5 dark:bg-cream/5 flex items-center justify-center">
                  <MessagesSquare className="w-7 h-7 text-charcoal/30 dark:text-cream/30" />
                </div>
                <p className="text-sm text-charcoal/50 dark:text-cream/50">
                  Không tìm thấy phiếu hỗ trợ nào với email này.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map(ticket => {
                  const cfg = STATUS_CONFIG[ticket.status]
                  const Icon = cfg.icon
                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-white/5 border border-charcoal/8 dark:border-cream/8 rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                      onClick={() => setSelected(ticket)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-[10px] text-charcoal/40 dark:text-cream/40 bg-charcoal/5 dark:bg-cream/5 px-2 py-0.5 rounded-md">
                              {ticket.id}
                            </span>
                            {ticket.category && (
                              <span className="text-[10px] text-charcoal/50 dark:text-cream/50 font-sans uppercase tracking-wide">
                                {ticket.category}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-charcoal dark:text-cream line-clamp-2 font-light leading-relaxed">
                            {ticket.message}
                          </p>
                          <p className="text-[11px] text-charcoal/40 dark:text-cream/40">
                            {new Date(ticket.createdAt || ticket.date).toLocaleString('vi-VN')}
                          </p>
                          {(ticket.replies?.length ?? 0) > 0 && (
                            <p className="text-[11px] text-primary font-medium">
                              ✦ {ticket.replies!.length} phản hồi từ nhà hàng
                            </p>
                          )}
                        </div>
                        <div className="shrink-0">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                            <Icon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Dialog */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Dialog header */}
              <div className="px-6 py-5 border-b border-charcoal/5 dark:border-cream/5 flex items-center justify-between shrink-0">
                <div>
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-cream/40 mb-0.5">Chi tiết phiếu</p>
                  <h3 className="font-serif text-lg text-charcoal dark:text-cream">{selected.id}</h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 dark:text-cream/40 dark:hover:text-cream dark:hover:bg-cream/5 transition-colors text-lg font-light"
                >
                  ✕
                </button>
              </div>

              {/* Dialog content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Status */}
                <div className="flex items-center gap-2">
                  {(() => {
                    const cfg = STATUS_CONFIG[selected.status]
                    const Icon = cfg.icon
                    return (
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    )
                  })()}
                  <span className="text-xs text-charcoal/40 dark:text-cream/40">{new Date(selected.createdAt || selected.date).toLocaleString('vi-VN')}</span>
                </div>

                {/* Category */}
                {selected.category && (
                  <p className="text-xs font-sans uppercase tracking-widest text-charcoal/50 dark:text-cream/50">
                    Loại: <span className="text-primary font-semibold">{selected.category}</span>
                  </p>
                )}

                {/* Conversation */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-charcoal dark:text-cream">Hội thoại</h4>
                  <div className="space-y-3 bg-charcoal/2 dark:bg-cream/2 rounded-2xl p-4 max-h-64 overflow-y-auto">
                    {/* Original message */}
                    <div className="flex flex-col items-start max-w-[85%] space-y-1">
                      <div className="bg-white dark:bg-white/10 border border-charcoal/8 dark:border-cream/8 text-charcoal dark:text-cream p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed">
                        {selected.message}
                      </div>
                      <span className="text-[10px] text-charcoal/40 dark:text-cream/40 ml-1">
                        Bạn — {new Date(selected.createdAt || selected.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Replies */}
                    {selected.replies?.map((reply, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[85%] space-y-1 ${reply.sender === 'Admin' ? 'items-end ml-auto' : 'items-start'}`}
                      >
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${reply.sender === 'Admin'
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-white dark:bg-white/10 border border-charcoal/8 dark:border-cream/8 text-charcoal dark:text-cream rounded-tl-none'
                          }`}>
                          {reply.content}
                        </div>
                        <span className="text-[10px] text-charcoal/40 dark:text-cream/40 mx-1">
                          {reply.sender === 'Admin' ? '✦ Nhà hàng' : 'Bạn'} — {reply.timestamp}
                        </span>
                      </div>
                    ))}

                    {(!selected.replies || selected.replies.length === 0) && (
                      <p className="text-xs text-charcoal/40 dark:text-cream/40 text-center py-4 italic">
                        Nhà hàng chưa phản hồi. Chúng tôi sẽ liên hệ trong 24 giờ.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dialog footer */}
              <div className="px-6 py-4 border-t border-charcoal/5 dark:border-cream/5 shrink-0">
                <button
                  onClick={() => setSelected(null)}
                  className="w-full py-2.5 rounded-xl border border-charcoal/10 dark:border-cream/10 text-sm font-sans text-charcoal/60 dark:text-cream/60 hover:text-charcoal dark:hover:text-cream hover:border-charcoal/20 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [tab, setTab] = useState<'submit' | 'tickets'>('submit')
  const { user, isAuthenticated } = useAuthStore()

  const TABS = [
    { id: 'submit', label: 'Gửi yêu cầu', icon: MessageCircle },
    { id: 'tickets', label: 'Phiếu của tôi', icon: ClipboardList },
  ] as const

  return (
    <div className="min-h-screen bg-cream dark:bg-background font-sans">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-4"
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary font-medium">
            La Pizzaia — Support Center
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-charcoal dark:text-cream leading-tight">
            Chúng tôi lắng <span className="text-primary italic">nghe</span>
          </h1>
          <p className="text-base text-charcoal/60 dark:text-cream/60 font-light leading-relaxed max-w-lg mx-auto">
            Mỗi ý kiến của bạn giúp chúng tôi hoàn thiện hơn. Hãy chia sẻ góp ý, 
            thắc mắc hay phàn nàn — chúng tôi cam kết phản hồi trong vòng 24 giờ.
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 max-w-[120px] mx-auto h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </section>

      {/* Tab switcher */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="inline-flex bg-charcoal/5 dark:bg-cream/5 rounded-2xl p-1 w-full">
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-sans transition-all duration-200 ${active
                  ? 'bg-white dark:bg-zinc-800 text-charcoal dark:text-cream shadow-sm font-medium'
                  : 'text-charcoal/50 dark:text-cream/50 hover:text-charcoal dark:hover:text-cream'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <section className="max-w-4xl mx-auto px-6 py-10 pb-24">
        <AnimatePresence mode="wait">
          {tab === 'submit' ? (
            <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SubmitForm
                userEmail={isAuthenticated ? user?.email : undefined}
                userName={isAuthenticated ? user?.username : undefined}
              />
            </motion.div>
          ) : (
            <motion.div key="tickets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MyTickets userEmail={isAuthenticated ? user?.email : undefined} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
