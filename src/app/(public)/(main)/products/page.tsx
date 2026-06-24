'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Check } from "lucide-react"
import Image from "next/image"
import { useProductListQuery } from "@/queries/useProduct"
import { useCartStore } from "@/store"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

export default function ProductsPage() {
  const { data: productListRes, isLoading } = useProductListQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { addItem, items } = useCartStore()

  const products = productListRes?.payload?.data || []

  // Filter available products
  const activeProducts = products.filter(p => p.status === 'Available')

  // Categories extraction
  const categories = ["all", ...Array.from(new Set(activeProducts.map(p => p.menu_name || 'pizza')))]

  // Filtered list
  const filteredProducts = activeProducts.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || product.menu_name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product._id,
      sizeId: product.size || 'M',
      sizeLabel: `Size ${product.size || 'M'}`,
      productName: product.product_name,
      price: product.price,
      quantity: 1,
      image: product.image
    })
    toast.success(`Đã thêm ${product.product_name} vào giỏ hàng!`)
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.4em] text-primary font-bold">The Selection</span>
          <h1 className="text-4xl md:text-6xl font-serif text-charcoal">Artisanal Menu</h1>
          <p className="font-sans text-charcoal/60 font-light max-w-xl mx-auto leading-relaxed">
            Discover our curated creations, made with imported Italian ingredients and baked to perfection in our 450°C wood-fired oven.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-charcoal/5 shadow-xl shadow-black/5">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-sans text-xs tracking-widest uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-charcoal text-cream shadow-lg shadow-black/20"
                    : "bg-white/60 text-charcoal/70 hover:bg-white hover:text-charcoal border border-charcoal/5"
                }`}
              >
                {cat === "all" ? "Tất cả" : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/60 focus:bg-white rounded-full border border-charcoal/5 font-sans text-sm focus:outline-hidden focus:ring-1 focus:ring-primary transition-all duration-300"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-96 bg-white/30 backdrop-blur-sm rounded-3xl animate-pulse border border-charcoal/5" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product) => {
                const inCart = items.some(item => item.productId === product._id)
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    key={product._id}
                    className="group bg-white/60 backdrop-blur-md rounded-3xl p-4 border border-charcoal/5 hover:border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Image Frame */}
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
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2 z-10">
                          <span className="bg-charcoal/80 backdrop-blur-xs text-cream text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-medium">
                            {product.menu_name}
                          </span>
                          <span className="bg-primary/95 text-dark text-[10px] font-bold px-3 py-1 rounded-full">
                            Size {product.size || 'M'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2 px-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-primary transition-colors">
                            {product.product_name}
                          </h3>
                        </div>
                        <p className="font-sans text-sm text-charcoal/60 line-clamp-2 font-light leading-relaxed h-10">
                          {product.description || "Hương vị thơm ngon truyền thống, được chuẩn bị kỹ lưỡng từ các nguyên liệu tươi mới mỗi ngày."}
                        </p>
                      </div>
                    </div>

                    {/* Price and Cart Button */}
                    <div className="flex items-center justify-between pt-6 border-t border-charcoal/5 px-1 mt-4">
                      <span className="font-serif italic text-primary text-xl font-bold tracking-wider">
                        {formatCurrency(product.price)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                          inCart
                            ? "bg-primary text-dark shadow-md"
                            : "bg-charcoal text-cream hover:bg-primary hover:text-dark hover:scale-105"
                        }`}
                      >
                        {inCart ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-4"
            >
              <p className="font-sans text-charcoal/40 text-lg">Không tìm thấy món ăn nào phù hợp.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}