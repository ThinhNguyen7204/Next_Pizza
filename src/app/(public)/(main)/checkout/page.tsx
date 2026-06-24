'use client'

import { useState, useMemo } from "react"
import { useCartStore, useAuthStore } from "@/store"
import { useGetVoucherList } from "@/queries/useVoucher"
import { useGetLoyaltyProgramList } from "@/queries/useLoyaltyProgram"
import { useCreateOrderMutation } from "@/queries/useOrder"
import { formatCurrency, handleErrorApi } from "@/lib/utils"
import { MapPin, Truck, Store, Tag, Award, CreditCard, ShoppingBag, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeliveryType, DiscountType } from "@/constants/type"
import { motion, AnimatePresence } from "framer-motion"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()

  // Form State
  const [deliveryType, setDeliveryType] = useState<string>(DeliveryType.Delivery)
  const [address, setAddress] = useState("")
  const [receiverName, setReceiverName] = useState(user?.username || "")
  const [phone, setPhone] = useState("")

  // Promotions State
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>("")
  const [selectedLoyaltyId, setSelectedLoyaltyId] = useState<string>("")

  // Success State
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdOrderCode, setCreatedOrderCode] = useState("")

  // Mutations & Queries
  const createOrderMutation = useCreateOrderMutation()
  const { data: voucherListRes } = useGetVoucherList()
  const { data: loyaltyListRes } = useGetLoyaltyProgramList()

  const vouchers = useMemo(() => {
    return (voucherListRes?.payload?.data || []).filter(v => v.is_active)
  }, [voucherListRes])

  const loyaltyPrograms = useMemo(() => {
    return (loyaltyListRes?.payload?.data || []).filter(p => p.is_active)
  }, [loyaltyListRes])

  // Calculations
  const subtotal = getTotal()

  const selectedVoucher = useMemo(() => {
    return vouchers.find(v => v._id === selectedVoucherId)
  }, [vouchers, selectedVoucherId])

  const selectedLoyalty = useMemo(() => {
    return loyaltyPrograms.find(p => p._id === selectedLoyaltyId)
  }, [loyaltyPrograms, selectedLoyaltyId])

  const voucherDiscount = useMemo(() => {
    if (!selectedVoucher) return 0
    if (selectedVoucher.discount_type === DiscountType.Percentage) {
      const discount = (subtotal * selectedVoucher.discount_value) / 100
      return selectedVoucher.max_discount ? Math.min(discount, selectedVoucher.max_discount) : discount
    }
    return selectedVoucher.discount_value
  }, [selectedVoucher, subtotal])

  const loyaltyDiscount = useMemo(() => {
    if (!selectedLoyalty) return 0
    if (selectedLoyalty.discount_type === DiscountType.Percentage) {
      return (subtotal * selectedLoyalty.discount_value) / 100
    }
    return selectedLoyalty.discount_value
  }, [selectedLoyalty, subtotal])

  const finalPrice = useMemo(() => {
    const price = subtotal - voucherDiscount - loyaltyDiscount
    return Math.max(0, price)
  }, [subtotal, voucherDiscount, loyaltyDiscount])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user) {
      toast.error("Vui lòng đăng nhập để đặt hàng!")
      return
    }

    if (items.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống!")
      return
    }

    if (deliveryType === DeliveryType.Delivery && !address.trim()) {
      toast.error("Vui lòng điền địa chỉ giao hàng!")
      return
    }

    try {
      const orderItems = items.map(item => ({
        product_id: item.productId,
        product_name: item.productName,
        price: item.price,
        quantity: item.quantity
      }))

      const body = {
        customer_id: user._id, // User account ID as customer ID
        delivery_type: deliveryType as any,
        address: deliveryType === DeliveryType.Delivery ? address : undefined,
        items: orderItems,
        voucher_id: selectedVoucherId || undefined,
        loyalty_program_id: selectedLoyaltyId || undefined,
        orderTotal: subtotal,
        discountAmount: voucherDiscount,
        discountLytP: loyaltyDiscount,
        finalPrice: finalPrice,
        paid: 0, // Unpaid initially
        status: 'Pending'
      }

      const result = await createOrderMutation.mutateAsync(body)
      setCreatedOrderCode(result.payload.data?._id || "Order Success")
      toast.success("Đặt hàng thành công!")
      clearCart()
      setIsSuccess(true)
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  // Success view
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md rounded-4xl p-8 md:p-12 border border-charcoal/5 shadow-2xl max-w-lg w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-primary animate-bounce" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal">Đặt hàng thành công!</h2>
          <p className="font-sans text-sm text-charcoal/60 leading-relaxed font-light">
            Cảm ơn bạn đã lựa chọn La Pizzaia. Đơn hàng của bạn đã được nhận và đang chờ đầu bếp xử lý.
          </p>
          <div className="bg-charcoal/5 p-4 rounded-2xl border border-charcoal/10 font-mono text-xs text-charcoal space-y-1">
            <p>Mã đơn hàng:</p>
            <p className="font-bold text-sm text-primary">{createdOrderCode}</p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/"
              className="bg-charcoal text-cream py-3 rounded-full font-sans text-xs tracking-widest uppercase hover:bg-primary hover:text-dark transition-colors duration-300 font-bold"
            >
              Về trang chủ
            </Link>
            <Link
              href="/products"
              className="border border-charcoal text-charcoal py-3 rounded-full font-sans text-xs tracking-widest uppercase hover:bg-charcoal hover:text-cream transition-colors duration-300"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // Not Logged In view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6 pt-24">
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-charcoal/5 shadow-2xl max-w-md w-full text-center space-y-6">
          <ShoppingBag className="w-12 h-12 text-charcoal/20 mx-auto stroke-1" />
          <h2 className="font-serif text-2xl text-charcoal">Yêu cầu đăng nhập</h2>
          <p className="font-sans text-sm text-charcoal/60 leading-relaxed font-light">
            Vui lòng đăng nhập tài khoản của bạn để tiến hành đặt hàng, thanh toán và tích điểm ưu đãi thành viên.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="bg-charcoal text-cream py-3 rounded-full font-sans text-xs tracking-widest uppercase hover:bg-primary hover:text-dark transition-colors duration-300 font-bold"
            >
              Đăng nhập ngay
            </Link>
            <Link
              href="/products"
              className="border border-charcoal text-charcoal py-3 rounded-full font-sans text-xs tracking-widest uppercase hover:bg-charcoal hover:text-cream transition-colors duration-300"
            >
              Quay lại thực đơn
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Back link */}
        <Link href="/products" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans text-xs tracking-widest uppercase">Quay lại thực đơn</span>
        </Link>

        <h1 className="font-serif text-3xl md:text-5xl text-charcoal">Thanh toán</h1>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Shipping details */}
          <div className="lg:col-span-7 bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-charcoal/5 shadow-xl space-y-6">
            <h2 className="font-serif text-xl text-charcoal border-b border-charcoal/5 pb-3">Thông tin nhận hàng</h2>

            {/* Delivery Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType(DeliveryType.Delivery)}
                className={`flex items-center justify-center gap-3 py-3.5 rounded-2xl border transition-all duration-300 ${
                  deliveryType === DeliveryType.Delivery
                    ? "bg-charcoal text-cream border-charcoal shadow-lg"
                    : "bg-white text-charcoal border-charcoal/10 hover:border-charcoal/30"
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="font-sans text-xs tracking-widest uppercase">Giao hàng tận nơi</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType(DeliveryType.Pickup)}
                className={`flex items-center justify-center gap-3 py-3.5 rounded-2xl border transition-all duration-300 ${
                  deliveryType === DeliveryType.Pickup
                    ? "bg-charcoal text-cream border-charcoal shadow-lg"
                    : "bg-white text-charcoal border-charcoal/10 hover:border-charcoal/30"
                }`}
              >
                <Store className="w-4 h-4" />
                <span className="font-sans text-xs tracking-widest uppercase">Tới nhà hàng lấy</span>
              </button>
            </div>

            {/* General Fields */}
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-wider text-charcoal/60">Họ và tên người nhận</label>
                <Input
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="Nhập tên người nhận"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-wider text-charcoal/60">Số điện thoại liên hệ</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại nhận hàng"
                  required
                />
              </div>

              {/* Address (Only for Delivery) */}
              {deliveryType === DeliveryType.Delivery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <label className="font-sans text-xs uppercase tracking-wider text-charcoal/60">Địa chỉ giao hàng</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-charcoal/40" />
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Nhập địa chỉ nhà, tên đường, quận/huyện"
                      className="pl-11"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-3 pt-4 border-t border-charcoal/5">
              <label className="font-sans text-xs uppercase tracking-wider text-charcoal/60">Phương thức thanh toán</label>
              <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border border-primary/20 shadow-xs">
                <CreditCard className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-sans text-sm font-semibold text-charcoal">Thanh toán khi nhận hàng (COD)</p>
                  <p className="font-sans text-xs text-charcoal/40">Giao dịch an toàn, tiện lợi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order summary and discount */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order Items */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-charcoal/5 shadow-xl space-y-4">
              <h2 className="font-serif text-lg text-charcoal border-b border-charcoal/5 pb-3">Đơn hàng của bạn</h2>

              <div className="max-h-64 overflow-y-auto space-y-4 pr-1">
                {items.length > 0 ? (
                  items.map(item => (
                    <div key={`${item.productId}__${item.sizeId}`} className="flex justify-between items-center gap-4">
                      <div className="text-left min-w-0">
                        <p className="font-serif text-sm text-charcoal truncate">{item.productName}</p>
                        <p className="font-sans text-[10px] text-charcoal/40 font-light">{item.sizeLabel} × {item.quantity}</p>
                      </div>
                      <span className="font-serif italic text-charcoal/80 text-sm shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="font-sans text-xs text-charcoal/40 text-center py-6">Chưa có sản phẩm nào trong đơn hàng.</p>
                )}
              </div>
            </div>

            {/* Promos & Vouchers */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-charcoal/5 shadow-xl space-y-4">
              <h2 className="font-serif text-lg text-charcoal border-b border-charcoal/5 pb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Ưu đãi & Khuyến mãi
              </h2>

              {/* Vouchers Selection */}
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-wider text-charcoal/60 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-primary" /> Mã giảm giá (Voucher)
                </label>
                <select
                  value={selectedVoucherId}
                  onChange={(e) => setSelectedVoucherId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/80 rounded-2xl border border-charcoal/10 font-sans text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-black"
                >
                  <option value="" className="text-black">Chọn Voucher áp dụng</option>
                  {vouchers.map(v => (
                    <option key={v._id} value={v._id} className="text-black">
                      {v.code} - Giảm {v.discount_type === DiscountType.Percentage ? `${v.discount_value}%` : formatCurrency(v.discount_value)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loyalty Program Selection */}
              <div className="space-y-2 pt-2">
                <label className="font-sans text-xs uppercase tracking-wider text-charcoal/60 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-primary" /> Chương trình đổi điểm tích luỹ
                </label>
                <select
                  value={selectedLoyaltyId}
                  onChange={(e) => setSelectedLoyaltyId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/80 rounded-2xl border border-charcoal/10 font-sans text-sm focus:outline-hidden focus:ring-1 focus:ring-primary text-black"
                >
                  <option value="" className="text-black">Chọn ưu đãi đổi điểm</option>
                  {loyaltyPrograms.map(p => (
                    <option key={p._id} value={p._id} className="text-black">
                      {p.name} ({p.points_required} điểm) - Giảm {p.discount_type === DiscountType.Percentage ? `${p.discount_value}%` : formatCurrency(p.discount_value)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Order Total summary */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-charcoal/5 shadow-xl space-y-4">
              <h2 className="font-serif text-lg text-charcoal border-b border-charcoal/5 pb-3">Chi tiết thanh toán</h2>

              <div className="space-y-3 font-sans text-sm">
                <div className="flex justify-between text-charcoal/60 font-light">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-red-500/80 font-light">
                    <span>Mã giảm giá ({selectedVoucher?.code})</span>
                    <span>- {formatCurrency(voucherDiscount)}</span>
                  </div>
                )}
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-red-500/80 font-light">
                    <span>Ưu đãi thành viên ({selectedLoyalty?.name})</span>
                    <span>- {formatCurrency(loyaltyDiscount)}</span>
                  </div>
                )}
                <div className="h-px bg-charcoal/5 my-2" />
                <div className="flex justify-between items-center font-bold">
                  <span className="text-charcoal">Tổng thanh toán</span>
                  <span className="font-serif italic text-primary text-2xl tracking-wider">{formatCurrency(finalPrice)}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={items.length === 0 || createOrderMutation.isPending}
                className="w-full mt-4 bg-charcoal text-cream py-4 rounded-full font-sans text-xs tracking-widest uppercase hover:bg-primary hover:text-dark transition-all duration-300 font-bold"
              >
                {createOrderMutation.isPending ? "Đang xử lý đặt hàng..." : "Xác nhận đặt hàng"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
