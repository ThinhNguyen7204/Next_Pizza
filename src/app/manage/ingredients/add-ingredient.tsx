'use client'

import { useState } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateIngredientBody, CreateIngredientBodyType } from "@/schemaValidations/ingredient.schema"
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
import { useAddIngredientMutation } from "@/queries/useIngredient"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

export default function AddIngredient() {
  const [open, setOpen] = useState(false)
  const addIngredientMutation = useAddIngredientMutation()

  const form = useForm<CreateIngredientBodyType>({
    resolver: zodResolver(CreateIngredientBody) as any,
    defaultValues: {
      name: '',
      quantity: 0,
      expiration_date: ''
    },
    mode: "onChange",
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateIngredientBodyType) => {
    if (addIngredientMutation.isPending) return
    try {
      const body = {
        ...values,
        quantity: values.quantity !== undefined ? Number(values.quantity) : undefined,
        expiration_date: values.expiration_date || undefined
      }
      const result = await addIngredientMutation.mutateAsync(body)
      toast.success(result.payload.message || 'Thêm nguyên liệu thành công!')
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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm nguyên liệu</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Thêm nguyên liệu mới</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Name field */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ingredient-name">Tên nguyên liệu</FieldLabel>
                  <Input
                    {...field}
                    id="ingredient-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: Bột mì, Phô mai Mozzarella"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Quantity field */}
            <Controller
              name="quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ingredient-quantity">Số lượng</FieldLabel>
                  <Input
                    {...field}
                    id="ingredient-quantity"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: 50"
                    autoComplete="off"
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Expiration date field */}
            <Controller
              name="expiration_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ingredient-exp">Ngày hết hạn</FieldLabel>
                  <Input
                    {...field}
                    id="ingredient-exp"
                    type="date"
                    aria-invalid={fieldState.invalid}
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
            <Button type="submit" disabled={addIngredientMutation.isPending}>
              Thêm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
