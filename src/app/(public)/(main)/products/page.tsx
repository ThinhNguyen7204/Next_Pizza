'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Check, X, ShoppingBag, Star, ChevronRight, Info } from "lucide-react"
import Image from "next/image"
import { useProductListQuery } from "@/queries/useProduct"
import { useCartStore } from "@/store"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

// ─── Size Config ──────────────────────────────────────────────────────────────
const SIZE_OPTIONS = [
  { id: 'S', label: 'S', sublabel: 'Nhỏ', desc: '⌀ 22cm', multiplier: 0.85 },
  { id: 'M', label: 'M', sublabel: 'Vừa', desc: '⌀ 28cm', multiplier: 1.0 },
  { id: 'L', label: 'L', sublabel: 'Lớn', desc: '⌀ 33cm', multiplier: 1.25 },
]

// Only show size picker for pizza and sides categories
const CATEGORIES_WITH_SIZE = ['pizza', 'sides']

function getSizePrice(basePrice: number, multiplier: number) {
  return Math.round(basePrice * multiplier / 1000) * 1000
}

// ─── Product Detail Drawer ────────────────────────────────────────────────────
function ProductDetailDrawer({
  product,
  onClose,
}: {
  product: any
  onClose: () => void
}) {
  const { addItem, items } = useCartStore()
  const hasSize = CATEGORIES_WITH_SIZE.includes((product.menu_name || '').toLowerCase())
  const defaultSize = product.size || 'M'
  const [selectedSize, setSelectedSize] = useState(defaultSize)

  const selectedSizeOpt = SIZE_OPTIONS.find(s => s.id === selectedSize) || SIZE_OPTIONS[1]
  const finalPrice = hasSize
    ? getSizePrice(product.price, selectedSizeOpt.multiplier)
    : product.price

  const inCart = items.some(
    item => item.productId === product._id && item.sizeId === selectedSize
  )

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      sizeId: selectedSize,
      sizeLabel: hasSize ? `Size ${selectedSize}` : '',
      productName: product.product_name,
      price: finalPrice,
      quantity: 1,
      image: product.image,
    })
    toast.success(`Đã thêm ${product.product_name}${hasSize ? ` (Size ${selectedSize})` : ''} vào giỏ!`)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream dark:bg-zinc-900 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Image */}
        <div className="relative aspect-4/3 shrink-0 bg-charcoal/5">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.product_name}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-serif text-charcoal/30 text-2xl">
              No image
            </div>
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-charcoal hover:bg-white transition-colors shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
          {/* Category badge */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-charcoal/80 backdrop-blur-xs text-cream text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-medium">
              {product.menu_name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Title + Rating */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-charcoal/20'}`} />
                ))}
              </div>
              <span className="font-sans text-xs text-charcoal/40">(4.0)</span>
            </div>
            <h2 className="font-serif text-3xl text-charcoal dark:text-cream leading-tight">
              {product.product_name}
            </h2>
          </div>

          {/* Description */}
          <p className="font-sans text-sm text-charcoal/65 dark:text-cream/65 leading-relaxed">
            {product.description || 'Hương vị thơm ngon truyền thống, được chuẩn bị kỹ lưỡng từ các nguyên liệu tươi mới mỗi ngày.'}
          </p>

          {/* Size Selector */}
          {hasSize && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal/50 dark:text-cream/50 font-semibold">
                  Chọn kích cỡ
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-charcoal/40 dark:text-cream/40">
                  <Info className="w-3 h-3" />
                  <span>Giá thay đổi theo size</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {SIZE_OPTIONS.map(size => {
                  const sizePrice = getSizePrice(product.price, size.multiplier)
                  const active = selectedSize === size.id
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`relative flex flex-col items-center py-3.5 px-2 rounded-2xl border-2 transition-all duration-200 ${
                        active
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-charcoal/10 dark:border-cream/10 hover:border-primary/40 bg-white/60 dark:bg-white/5'
                      }`}
                    >
                      {/* Size letter */}
                      <span className={`font-serif text-2xl font-bold leading-none mb-0.5 ${active ? 'text-primary' : 'text-charcoal/70 dark:text-cream/70'}`}>
                        {size.label}
                      </span>
                      <span className={`font-sans text-[10px] uppercase tracking-wide ${active ? 'text-primary/70' : 'text-charcoal/40 dark:text-cream/40'}`}>
                        {size.sublabel}
                      </span>
                      <span className={`font-sans text-[10px] mt-1 ${active ? 'text-charcoal/50' : 'text-charcoal/30 dark:text-cream/30'}`}>
                        {size.desc}
                      </span>
                      <span className={`font-sans text-xs font-semibold mt-2 ${active ? 'text-primary' : 'text-charcoal/60 dark:text-cream/60'}`}>
                        {formatCurrency(sizePrice)}
                      </span>
                      {active && (
                        <motion.div
                          layoutId="size-indicator"
                          className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-charcoal/5 dark:bg-cream/5" />

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Nguyên liệu', value: 'Nhập khẩu Ý' },
              { label: 'Lò nướng', value: '450°C củi' },
              { label: 'Chuẩn bị', value: '15–20 phút' },
              { label: 'Phục vụ', value: 'Nóng hổi' },
            ].map(item => (
              <div key={item.label} className="bg-white/60 dark:bg-white/5 rounded-xl px-3.5 py-3 border border-charcoal/5 dark:border-cream/5">
                <p className="font-sans text-[10px] tracking-widest uppercase text-charcoal/40 dark:text-cream/40">{item.label}</p>
                <p className="font-sans text-xs font-medium text-charcoal dark:text-cream mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="shrink-0 px-6 py-5 border-t border-charcoal/5 dark:border-cream/5 bg-cream/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-sans text-[10px] tracking-widest uppercase text-charcoal/40 dark:text-cream/40 mb-0.5">
                {hasSize ? `Size ${selectedSize} · Tổng` : 'Giá'}
              </p>
              <p className="font-serif italic text-primary text-2xl font-bold">
                {formatCurrency(finalPrice)}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full font-sans text-sm tracking-widest uppercase transition-all duration-300 ${
                inCart
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 cursor-default'
                  : 'bg-charcoal dark:bg-cream text-cream dark:text-charcoal hover:bg-primary hover:scale-105 shadow-lg shadow-black/10'
              }`}
            >
              {inCart ? (
                <><Check className="w-4 h-4" /> Đã thêm</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Thêm vào giỏ</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onOpenDetail,
}: {
  product: any
  onOpenDetail: (p: any) => void
}) {
  const { addItem, items } = useCartStore()
  const inCart = items.some(item => item.productId === product._id)
  const hasSize = CATEGORIES_WITH_SIZE.includes((product.menu_name || '').toLowerCase())

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasSize) {
      // Open detail to pick size
      onOpenDetail(product)
      return
    }
    addItem({
      productId: product._id,
      sizeId: '',
      sizeLabel: '',
      productName: product.product_name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
    toast.success(`Đã thêm ${product.product_name} vào giỏ hàng!`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group bg-white/60 backdrop-blur-md rounded-3xl p-4 border border-charcoal/5 hover:border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between cursor-pointer"
      onClick={() => onOpenDetail(product)}
    >
      <div className="space-y-4">
        {/* Image */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-charcoal/5">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.product_name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-serif text-charcoal/30">
              No image
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <span className="bg-charcoal/80 backdrop-blur-xs text-cream text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-medium">
              {product.menu_name}
            </span>
          </div>
          {/* "Xem chi tiết" overlay */}
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm text-charcoal text-xs font-sans tracking-widest uppercase px-4 py-2 rounded-full flex items-center gap-1.5 shadow"
            >
              Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 px-1">
          <h3 className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-primary transition-colors">
            {product.product_name}
          </h3>
          <p className="font-sans text-sm text-charcoal/60 line-clamp-2 font-light leading-relaxed h-10">
            {product.description || 'Hương vị thơm ngon truyền thống, được chuẩn bị kỹ lưỡng từ các nguyên liệu tươi mới mỗi ngày.'}
          </p>

          {/* Size chips — only for relevant categories */}
          {hasSize && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="font-sans text-[10px] text-charcoal/40 uppercase tracking-wider">Size:</span>
              {SIZE_OPTIONS.map(s => (
                <span
                  key={s.id}
                  className={`font-sans text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    s.id === (product.size || 'M')
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-charcoal/4 border-charcoal/10 text-charcoal/40'
                  }`}
                >
                  {s.id}
                </span>
              ))}
              <span className="font-sans text-[10px] text-charcoal/30 ml-1">· Chọn trong chi tiết</span>
            </div>
          )}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between pt-6 border-t border-charcoal/5 px-1 mt-4">
        <div>
          <span className="font-serif italic text-primary text-xl font-bold tracking-wider">
            {formatCurrency(product.price)}
          </span>
          {hasSize && (
            <span className="font-sans text-[10px] text-charcoal/40 block">từ size S</span>
          )}
        </div>
        <button
          onClick={handleQuickAdd}
          className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
            inCart
              ? 'bg-primary text-white shadow-md'
              : 'bg-charcoal text-cream hover:bg-primary hover:text-white hover:scale-105'
          }`}
          title={hasSize ? 'Chọn size & thêm vào giỏ' : 'Thêm vào giỏ'}
        >
          {inCart ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { data: productListRes, isLoading } = useProductListQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [detailProduct, setDetailProduct] = useState<any>(null)

  const products = productListRes?.payload?.data || []
  const activeProducts = products.filter((p: any) => p.status === 'Available')
  const categories = ["all", ...Array.from(new Set(activeProducts.map((p: any) => p.menu_name || 'pizza')))]

  const filteredProducts = activeProducts.filter((product: any) => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || product.menu_name === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.4em] text-primary font-bold">The Selection</span>
          <h1 className="text-4xl md:text-6xl font-serif text-charcoal">Artisanal Menu</h1>
          <p className="font-sans text-charcoal/60 font-light max-w-xl mx-auto leading-relaxed">
            Discover our curated creations, made with imported Italian ingredients and baked to perfection in our 450°C wood-fired oven.
          </p>
        </div>

        {/* Filter + Search */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-charcoal/5 shadow-xl shadow-black/5">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-sans text-xs tracking-widest uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-charcoal text-cream shadow-lg shadow-black/20'
                    : 'bg-white/60 text-charcoal/70 hover:bg-white hover:text-charcoal border border-charcoal/5'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/60 focus:bg-white rounded-full border border-charcoal/5 font-sans text-sm focus:outline-hidden focus:ring-1 focus:ring-primary transition-all duration-300"
            />
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-96 bg-white/30 backdrop-blur-sm rounded-3xl animate-pulse border border-charcoal/5" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product: any) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onOpenDetail={setDetailProduct}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-sans text-charcoal/40 text-lg">Không tìm thấy món ăn nào phù hợp.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Detail Drawer */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailDrawer
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}