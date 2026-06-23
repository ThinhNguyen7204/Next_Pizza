'use client'

import { useEffect } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateLoyaltyProgramBody, UpdateLoyaltyProgramBodyType } from "@/schemaValidations/loyaltyProgram.schema"
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
import { useGetLoyaltyProgramDetail, useUpdateLoyaltyProgramMutation } from "@/queries/useLoyaltyProgram"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

interface Props {
  id: string | undefined
  setId: (value: string | undefined) => void
}

export default function EditPromote({ id, setId }: Props) {
  const updateLoyaltyProgramMutation = useUpdateLoyaltyProgramMutation()
  const { data } = useGetLoyaltyProgramDetail(id as string, Boolean(id))

  const form = useForm<UpdateLoyaltyProgramBodyType>({
    resolver: zodResolver(UpdateLoyaltyProgramBody) as any,
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

  useEffect(() => {
    if (data?.payload?.data) {
      const p = data.payload.data
      form.reset({
        name: p.name || '',
        description: p.description || '',
        points_required: p.points_required ?? 0,
        discount_type: p.discount_type || DiscountType.Percentage,
        discount_value: p.discount_value || 0,
        is_active: p.is_active ?? true
      })
    }
  }, [data, form])

  const reset = () => {
    setId(undefined)
  }

  const onSubmit = async (values: UpdateLoyaltyProgramBodyType) => {
    if (updateLoyaltyProgramMutation.isPending || !id) return
    try {
      const body = {
        ...values,
        points_required: values.points_required !== undefined ? Number(values.points_required) : undefined,
        discount_value: values.discount_value !== undefined ? Number(values.discount_value) : undefined,
        description: values.description || undefined
      }
      const result = await updateLoyaltyProgramMutation.mutateAsync({
        ...body,
        id
      })
      toast.success(result.payload.message || 'Cập nhật ưu đãi thành công!')
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
            <DialogTitle>Chỉnh sửa ưu đãi</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-promote-name">Tên chương trình</FieldLabel>
                  <Input
                    {...field}
                    id="edit-promote-name"
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
                  <FieldLabel htmlFor="edit-promote-points">Điểm yêu cầu</FieldLabel>
                  <Input
                    {...field}
                    id="edit-promote-points"
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
                  <FieldLabel htmlFor="edit-promote-type">Loại giảm giá</FieldLabel>
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
                  <FieldLabel htmlFor="edit-promote-value">Mức giảm giá</FieldLabel>
                  <Input
                    {...field}
                    id="edit-promote-value"
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
                  <FieldLabel htmlFor="edit-promote-active">Trạng thái</FieldLabel>
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
                  <FieldLabel htmlFor="edit-promote-desc">Mô tả</FieldLabel>
                  <Textarea
                    {...field}
                    id="edit-promote-desc"
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
                reset()
              }}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateLoyaltyProgramMutation.isPending}>
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
