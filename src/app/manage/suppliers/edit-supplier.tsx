'use client'

import { useEffect } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateSupplierBody, UpdateSupplierBodyType } from "@/schemaValidations/supplier.schema"
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
import { useGetSupplierDetail, useUpdateSupplierMutation } from "@/queries/useSupplier"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

interface Props {
  id: string | undefined
  setId: (value: string | undefined) => void
}

export default function EditSupplier({ id, setId }: Props) {
  const updateSupplierMutation = useUpdateSupplierMutation()
  const { data } = useGetSupplierDetail(id as string, Boolean(id))

  const form = useForm<UpdateSupplierBodyType>({
    resolver: zodResolver(UpdateSupplierBody) as any,
    defaultValues: {
      supplier_name: '',
      phone: '',
      rating: 5,
      supplier_address: '',
      email: '',
      description: ''
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (data?.payload?.data) {
      const s = data.payload.data
      form.reset({
        supplier_name: s.supplier_name || '',
        phone: s.phone || '',
        rating: s.rating ?? 5,
        supplier_address: s.supplier_address || '',
        email: s.email || '',
        description: s.description || ''
      })
    }
  }, [data, form])

  const reset = () => {
    setId(undefined)
  }

  const onSubmit = async (values: UpdateSupplierBodyType) => {
    if (updateSupplierMutation.isPending || !id) return
    try {
      const body = {
        ...values,
        rating: values.rating !== undefined ? Number(values.rating) : undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        supplier_address: values.supplier_address || undefined,
        description: values.description || undefined
      }
      const result = await updateSupplierMutation.mutateAsync({
        ...body,
        id
      })
      toast.success(result.payload.message || 'Cập nhật nhà cung cấp thành công!')
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
            <DialogTitle>Chỉnh sửa nhà cung cấp</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Supplier Name */}
            <Controller
              name="supplier_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-supplier-name">Tên nhà cung cấp</FieldLabel>
                  <Input
                    {...field}
                    id="edit-supplier-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: Công ty Cổ phần Sữa Việt Nam"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Phone */}
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-supplier-phone">Số điện thoại</FieldLabel>
                  <Input
                    {...field}
                    id="edit-supplier-phone"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 0987654321"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-supplier-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="edit-supplier-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: contact@supplier.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Address */}
            <Controller
              name="supplier_address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-supplier-address">Địa chỉ</FieldLabel>
                  <Input
                    {...field}
                    id="edit-supplier-address"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 123 Đường Láng, Hà Nội"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Rating */}
            <Controller
              name="rating"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-supplier-rating">Đánh giá (1-5)</FieldLabel>
                  <Input
                    {...field}
                    id="edit-supplier-rating"
                    type="number"
                    min={1}
                    max={5}
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 5"
                    autoComplete="off"
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
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
                  <FieldLabel htmlFor="edit-supplier-desc">Mô tả</FieldLabel>
                  <Textarea
                    {...field}
                    id="edit-supplier-desc"
                    aria-invalid={fieldState.invalid}
                    placeholder="Thông tin thêm về nhà cung cấp..."
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
            <Button type="submit" disabled={updateSupplierMutation.isPending}>
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
