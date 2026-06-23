'use client'

import { useState } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateLoyaltyProgramBody, CreateLoyaltyProgramBodyType } from "@/schemaValidations/loyaltyProgram.schema"
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
import { useAddLoyaltyProgramMutation } from "@/queries/useLoyaltyProgram"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

export default function AddPromote() {
  const [open, setOpen] = useState(false)
  const addLoyaltyProgramMutation = useAddLoyaltyProgramMutation()

  const form = useForm<CreateLoyaltyProgramBodyType>({
    resolver: zodResolver(CreateLoyaltyProgramBody) as any,
    defaultValues: {
      name: '',
      description: '',
      points_required: 0,
      discount_type: DiscountType.Percentage,
      discount_value: 0,
      is_active: true
    },
    mode: "onChange",
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateLoyaltyProgramBodyType) => {
    if (addLoyaltyProgramMutation.isPending) return
    try {
      const body = {
        ...values,
        points_required: Number(values.points_required),
        discount_value: Number(values.discount_value),
        description: values.description || undefined
      }
      const result = await addLoyaltyProgramMutation.mutateAsync(body)
      toast.success(result.payload.message || 'Thêm ưu đãi thành công!')
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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm ưu đãi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px] max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Thêm ưu đãi mới</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="promote-name">Tên chương trình</FieldLabel>
                  <Input
                    {...field}
                    id="promote-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: Giảm 50k cho khách hàng thân thiết"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Points Required */}
            <Controller
              name="points_required"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="promote-points">Điểm yêu cầu</FieldLabel>
                  <Input
                    {...field}
                    id="promote-points"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 100"
                    autoComplete="off"
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FieldLabel htmlFor="promote-type">Loại giảm giá</FieldLabel>
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
                  <FieldLabel htmlFor="promote-value">Mức giảm giá</FieldLabel>
                  <Input
                    {...field}
                    id="promote-value"
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

            {/* Is Active */}
            <Controller
              name="is_active"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="promote-active">Trạng thái</FieldLabel>
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
                  <FieldLabel htmlFor="promote-desc">Mô tả</FieldLabel>
                  <Textarea
                    {...field}
                    id="promote-desc"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập mô tả cho chương trình ưu đãi..."
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
            <Button type="submit" disabled={addLoyaltyProgramMutation.isPending}>
              Thêm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
