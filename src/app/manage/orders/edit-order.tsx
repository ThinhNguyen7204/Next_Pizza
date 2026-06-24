'use client'

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UpdateOrderBody, UpdateOrderBodyType } from "@/schemaValidations/order.schema"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetOrderDetail, useUpdateOrderMutation } from "@/queries/useOrder"
import { toast } from "sonner"
import { formatCurrency, handleErrorApi, getVietnameseOrderStatus } from "@/lib/utils"
import { OrderStatus } from "@/constants/type"

interface Props {
  id: string | undefined
  setId: (value: string | undefined) => void
}

export default function EditOrder({ id, setId }: Props) {
  const { data, isLoading, refetch } = useGetOrderDetail(id as string, Boolean(id))
  const order = data?.payload?.data
  const updateOrderMutation = useUpdateOrderMutation()

  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody) as any,
    defaultValues: {
      status: OrderStatus.Pending
    }
  })

  useEffect(() => {
    if (order) {
      form.reset({
        status: order.status || OrderStatus.Pending
      })
    }
  }, [order, form])

  const reset = () => {
    setId(undefined)
  }

  const onSubmit = async (values: UpdateOrderBodyType) => {
    if (updateOrderMutation.isPending || !id) return
    try {
      const result = await updateOrderMutation.mutateAsync({
        ...values,
        id
      })
      toast.success(result.payload.message || 'Cập nhật trạng thái đơn hàng thành công!')
      reset()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog open={Boolean(id)} onOpenChange={(val) => {
      if (!val) reset()
    }}>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Chi tiết Đơn hàng</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">Đang tải chi tiết đơn hàng...</div>
        ) : !order ? (
          <div className="py-12 text-center text-muted-foreground">Không tìm thấy đơn hàng.</div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* General Info */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-xl border border-border">
              <div>
                <p className="text-muted-foreground">Mã đơn hàng</p>
                <p className="font-mono font-medium">{order._id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ngày đặt hàng</p>
                <p className="font-medium">
                   {new Date(order.order_date).toLocaleString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Hình thức nhận</p>
                <p className="font-medium">
                  {order.delivery_type === 'Delivery' ? '🚗 Giao hàng tận nơi' : '🏪 Nhận tại cửa hàng'}
                </p>
              </div>
              {order.address && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Địa chỉ giao hàng</p>
                  <p className="font-medium">{order.address}</p>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div>
              <h3 className="font-serif text-lg mb-2">Sản phẩm đã đặt</h3>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="p-3 font-semibold text-muted-foreground">Tên món</th>
                      <th className="p-3 font-semibold text-muted-foreground text-center">SL</th>
                      <th className="p-3 font-semibold text-muted-foreground text-right">Đơn giá</th>
                      <th className="p-3 font-semibold text-muted-foreground text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/40">
                        <td className="p-3 font-medium">{item.product_name}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                        <td className="p-3 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng tiền món:</span>
                <span>{formatCurrency(order.orderTotal || 0)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Giảm giá (Voucher):</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              {order.discountLytP > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Ưu đãi (Loyalty Points):</span>
                  <span>-{formatCurrency(order.discountLytP)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-dashed border-border pt-2">
                <span>Tổng thanh toán:</span>
                <span className="text-primary">{formatCurrency(order.finalPrice || 0)}</span>
              </div>
            </div>

            {/* Status Select */}
            <FieldGroup className="border-t border-border pt-4">
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="order-status" className="font-semibold">Trạng thái đơn hàng</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={OrderStatus.Pending}>Chờ xử lý (Pending)</SelectItem>
                        <SelectItem value={OrderStatus.Processing}>Đang chế biến (Processing)</SelectItem>
                        <SelectItem value={OrderStatus.Shipping}>Đang giao (Shipping)</SelectItem>
                        <SelectItem value={OrderStatus.Delivered}>Đã giao hàng (Delivered)</SelectItem>
                        <SelectItem value={OrderStatus.Paid}>Đã thanh toán (Paid)</SelectItem>
                        <SelectItem value={OrderStatus.Cancelled}>Đã huỷ (Cancelled)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter className="border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={reset}>Đóng</Button>
              <Button type="submit" disabled={updateOrderMutation.isPending}>
                {updateOrderMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
