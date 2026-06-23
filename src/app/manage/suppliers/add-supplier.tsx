'use client'

import { useState } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateSupplierBody, CreateSupplierBodyType } from "@/schemaValidations/supplier.schema"
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
import { useAddSupplierMutation } from "@/queries/useSupplier"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

export default function AddSupplier() {
  const [open, setOpen] = useState(false)
  const addSupplierMutation = useAddSupplierMutation()

  const form = useForm<CreateSupplierBodyType>({
    resolver: zodResolver(CreateSupplierBody) as any,
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

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateSupplierBodyType) => {
    if (addSupplierMutation.isPending) return
    try {
      const body = {
        ...values,
        rating: values.rating !== undefined ? Number(values.rating) : undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        supplier_address: values.supplier_address || undefined,
        description: values.description || undefined
      }
      const result = await addSupplierMutation.mutateAsync(body)
      toast.success(result.payload.message || 'Thêm nhà cung cấp thành công!')
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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm nhà cung cấp</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px] max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Supplier Name */}
            <Controller
              name="supplier_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="supplier-name">Tên nhà cung cấp</FieldLabel>
                  <Input
                    {...field}
                    id="supplier-name"
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
                  <FieldLabel htmlFor="supplier-phone">Số điện thoại</FieldLabel>
                  <Input
                    {...field}
                    id="supplier-phone"
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
                  <FieldLabel htmlFor="supplier-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="supplier-email"
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
                  <FieldLabel htmlFor="supplier-address">Địa chỉ</FieldLabel>
                  <Input
                    {...field}
                    id="supplier-address"
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
                  <FieldLabel htmlFor="supplier-rating">Đánh giá (1-5)</FieldLabel>
                  <Input
                    {...field}
                    id="supplier-rating"
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
                  <FieldLabel htmlFor="supplier-desc">Mô tả</FieldLabel>
                  <Textarea
                    {...field}
                    id="supplier-desc"
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
                setOpen(false)
                reset()
              }}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={addSupplierMutation.isPending}>
              Thêm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
