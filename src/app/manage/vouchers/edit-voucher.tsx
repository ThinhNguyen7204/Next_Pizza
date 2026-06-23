'use client'

import { useEffect } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateVoucherBody, UpdateVoucherBodyType } from "@/schemaValidations/voucher.schema"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { useGetVoucherDetail, useUpdateVoucherMutation } from "@/queries/useVoucher"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

interface Props {
  id: string | undefined
  setId: (value: string | undefined) => void
}

export default function EditVoucher({ id, setId }: Props) {
  const updateVoucherMutation = useUpdateVoucherMutation()
  const { data } = useGetVoucherDetail(id as string, Boolean(id))

  const form = useForm<UpdateVoucherBodyType>({
    resolver: zodResolver(UpdateVoucherBody) as any,
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

  useEffect(() => {
    if (data?.payload?.data) {
      const v = data.payload.data
      let startDateStr = ''
      let endDateStr = ''
      try {
        if (v.start_date) startDateStr = new Date(v.start_date).toISOString().split('T')[0]
        if (v.end_date) endDateStr = new Date(v.end_date).toISOString().split('T')[0]
      } catch (e) {
        // Fallback or ignore
      }
      form.reset({
        code: v.code || '',
        description: v.description || '',
        discount_type: v.discount_type || DiscountType.Percentage,
        discount_value: v.discount_value || 0,
        min_order_value: v.min_order_value ?? 0,
        max_discount: v.max_discount ?? 0,
        start_date: startDateStr,
        end_date: endDateStr,
        usage_limit: v.usage_limit ?? 0,
        is_active: v.is_active ?? true
      })
    }
  }, [data, form])

  const reset = () => {
    setId(undefined)
  }

  const onSubmit = async (values: UpdateVoucherBodyType) => {
    if (updateVoucherMutation.isPending || !id) return
    try {
      const body = {
        ...values,
        discount_value: values.discount_value !== undefined ? Number(values.discount_value) : undefined,
        min_order_value: values.min_order_value !== undefined ? Number(values.min_order_value) : undefined,
        max_discount: values.max_discount !== undefined ? Number(values.max_discount) : undefined,
        usage_limit: values.usage_limit !== undefined ? Number(values.usage_limit) : undefined,
        description: values.description || undefined
      }
      const result = await updateVoucherMutation.mutateAsync({
        ...body,
        id
      })
      toast.success(result.payload.message || 'Cập nhật mã giảm giá thành công!')
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
      <DialogContent className='sm:max-w-[450px] max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Chỉnh sửa voucher</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Code */}
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-voucher-code">Mã voucher</FieldLabel>
                  <Input
                    {...field}
                    id="edit-voucher-code"
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
                  <FieldLabel htmlFor="edit-voucher-type">Loại giảm giá</FieldLabel>
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
                  <FieldLabel htmlFor="edit-voucher-value">Mức giảm giá</FieldLabel>
                  <Input
                    {...field}
                    id="edit-voucher-value"
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
                  <FieldLabel htmlFor="edit-voucher-min">Giá trị đơn hàng tối thiểu (VND)</FieldLabel>
                  <Input
                    {...field}
                    id="edit-voucher-min"
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
                  <FieldLabel htmlFor="edit-voucher-max">Giảm tối đa (VND)</FieldLabel>
                  <Input
                    {...field}
                    id="edit-voucher-max"
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
                  <FieldLabel htmlFor="edit-voucher-start">Ngày bắt đầu</FieldLabel>
                  <Input
                    {...field}
                    id="edit-voucher-start"
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
                  <FieldLabel htmlFor="edit-voucher-end">Ngày kết thúc</FieldLabel>
                  <Input
                    {...field}
                    id="edit-voucher-end"
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
                  <FieldLabel htmlFor="edit-voucher-limit">Giới hạn số lần sử dụng</FieldLabel>
                  <Input
                    {...field}
                    id="edit-voucher-limit"
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
                  <FieldLabel htmlFor="edit-voucher-active">Trạng thái</FieldLabel>
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
                  <FieldLabel htmlFor="edit-voucher-desc">Mô tả</FieldLabel>
                  <Textarea
                    {...field}
                    id="edit-voucher-desc"
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
                reset()
              }}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateVoucherMutation.isPending}>
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
