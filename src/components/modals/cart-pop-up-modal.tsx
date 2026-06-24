'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { useCartStore } from "@/store"
import { formatCurrency } from "@/lib/utils"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CartPopUpModal() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotal } = useCartStore()

  const subtotal = getTotal()

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full bg-cream border-l border-charcoal/5 shadow-2xl p-0">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-charcoal/5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <SheetTitle className="font-serif text-2xl text-charcoal">Giỏ hàng của bạn</SheetTitle>
          </div>
          <SheetDescription className="font-sans text-xs text-charcoal/40 tracking-wider">
            Bạn đang có {items.length} món trong giỏ hàng
          </SheetDescription>
        </SheetHeader>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={`${item.productId}__${item.sizeId}`}
                className="flex gap-4 items-center bg-white/40 p-3 rounded-2xl border border-charcoal/5 shadow-xs"
              >
                {/* Item Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-charcoal/5 shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-serif text-[10px] text-charcoal/30">
                      PIZZA
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-serif text-sm text-charcoal truncate">{item.productName}</h4>
                  <p className="font-sans text-[10px] text-primary font-bold tracking-wider">{item.sizeLabel}</p>
                  <p className="font-serif italic text-charcoal/80 text-xs">{formatCurrency(item.price)}</p>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-white border border-charcoal/5 rounded-full p-0.5">
                    <button
                      onClick={() => updateQuantity(item.productId, item.sizeId, item.quantity - 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal/60 hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-sans text-xs font-semibold text-charcoal">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.sizeId, item.quantity + 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal/60 hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.sizeId)}
                    className="text-red-500/80 hover:text-red-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center py-20">
              <ShoppingBag className="w-12 h-12 text-charcoal/20 stroke-1" />
              <p className="font-sans text-sm text-charcoal/40">Giỏ hàng của bạn đang trống.</p>
              <Button
                variant="outline"
                onClick={toggleCart}
                className="font-sans text-xs tracking-widest uppercase rounded-full border-charcoal hover:bg-charcoal hover:text-cream"
              >
                Tiếp tục xem thực đơn
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="p-6 bg-white/60 backdrop-blur-md border-t border-charcoal/5 flex flex-col gap-4 mt-auto">
            <div className="flex justify-between items-center w-full">
              <span className="font-sans text-sm text-charcoal/60 font-light">Tạm tính</span>
              <span className="font-serif italic text-primary text-xl font-bold tracking-wider">{formatCurrency(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="w-full bg-charcoal text-cream text-center py-3.5 rounded-full font-sans text-xs tracking-widest uppercase hover:bg-primary hover:text-dark transition-all duration-300 font-bold"
            >
              Tiến hành thanh toán
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}