'use client'

import { useState } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateVoucherBody, CreateVoucherBodyType } from "@/schemaValidations/voucher.schema"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DiscountType } from "@/constants/type"
import { useAddVoucherMutation } from "@/queries/useVoucher"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

export default function AddVoucher() {
  const [open, setOpen] = useState(false)
  const addVoucherMutation = useAddVoucherMutation()

  const form = useForm<CreateVoucherBodyType>({
    resolver: zodResolver(CreateVoucherBody) as any,
    defaultValues: {
      code: '',
      description: '',
      discount_type: DiscountType.Percentage,
      discount_value: 0,
      min_order_value: 0,
      max_discount: 0,
      start_date: '',
      end_date: '',
      usage_limit: 0,
      is_active: true
    },
    mode: "onChange",
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateVoucherBodyType) => {
    if (addVoucherMutation.isPending) return
    try {
      const body = {
        ...values,
        discount_value: Number(values.discount_value),
        min_order_value: values.min_order_value !== undefined ? Number(values.min_order_value) : undefined,
        max_discount: values.max_discount !== undefined ? Number(values.max_discount) : undefined,
        usage_limit: values.usage_limit !== undefined ? Number(values.usage_limit) : undefined,
        description: values.description || undefined
      }
      const result = await addVoucherMutation.mutateAsync(body)
      toast.success(result.payload.message || 'Thêm mã giảm giá thành công!')
      reset()
      setOpen(false)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) reset()
    }}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1' type="button">
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm voucher</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px] max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Thêm voucher mới</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Code */}
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-code">Mã voucher</FieldLabel>
                  <Input
                    {...field}
                    id="voucher-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: PIZZA50K"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Discount Type */}
            <Controller
              name="discount_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-type">Loại giảm giá</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full text-black">
                      <SelectValue placeholder="Chọn loại giảm giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DiscountType.Percentage}>Phần trăm (%)</SelectItem>
                      <SelectItem value={DiscountType.FixedAmount}>Số tiền cố định (VND)</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Discount Value */}
            <Controller
              name="discount_value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-value">Mức giảm giá</FieldLabel>
                  <Input
                    {...field}
                    id="voucher-value"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 10 (%) hoặc 50000 (VND)"
                    autoComplete="off"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Min Order Value */}
            <Controller
              name="min_order_value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-min">Giá trị đơn hàng tối thiểu (VND)</FieldLabel>
                  <Input
                    {...field}
                    id="voucher-min"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 100000"
                    autoComplete="off"
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Max Discount */}
            <Controller
              name="max_discount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-max">Giảm tối đa (VND)</FieldLabel>
                  <Input
                    {...field}
                    id="voucher-max"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 30000"
                    autoComplete="off"
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Start Date */}
            <Controller
              name="start_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-start">Ngày bắt đầu</FieldLabel>
                  <Input
                    {...field}
                    id="voucher-start"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* End Date */}
            <Controller
              name="end_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-end">Ngày kết thúc</FieldLabel>
                  <Input
                    {...field}
                    id="voucher-end"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Usage Limit */}
            <Controller
              name="usage_limit"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-limit">Giới hạn số lần sử dụng</FieldLabel>
                  <Input
                    {...field}
                    id="voucher-limit"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 100"
                    autoComplete="off"
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Is Active */}
            <Controller
              name="is_active"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-active">Trạng thái</FieldLabel>
                  <Select onValueChange={(val) => field.onChange(val === 'true')} value={field.value ? 'true' : 'false'}>
                    <SelectTrigger className="w-full text-black">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Hoạt động</SelectItem>
                      <SelectItem value="false">Tạm ngưng</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="voucher-desc">Mô tả</FieldLabel>
                  <Textarea
                    {...field}
                    id="voucher-desc"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập mô tả cho voucher..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                reset()
              }}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={addVoucherMutation.isPending}>
              Thêm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
