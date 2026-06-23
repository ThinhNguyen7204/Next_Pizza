'use client'

import { useState, useEffect } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateIngredientBody, UpdateIngredientBodyType } from "@/schemaValidations/ingredient.schema"
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
import { useGetIngredientDetail, useUpdateIngredientMutation } from "@/queries/useIngredient"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

interface Props {
  id: string | undefined
  setId: (value: string | undefined) => void
}

export default function EditIngredient({ id, setId }: Props) {
  const updateIngredientMutation = useUpdateIngredientMutation()

  const { data } = useGetIngredientDetail(id as string, Boolean(id))

  const form = useForm<UpdateIngredientBodyType>({
    resolver: zodResolver(UpdateIngredientBody) as any,
    defaultValues: {
      name: '',
      quantity: 0,
      expiration_date: ''
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (data?.payload?.data) {
      const ingredient = data.payload.data
      let expDate = ''
      if (ingredient.expiration_date) {
        try {
          expDate = new Date(ingredient.expiration_date).toISOString().split('T')[0]
        } catch (e) {
          expDate = ''
        }
      }
      form.reset({
        name: ingredient.name || '',
        quantity: ingredient.quantity ?? 0,
        expiration_date: expDate
      })
    }
  }, [data, form])

  const reset = () => {
    setId(undefined)
  }

  const onSubmit = async (values: UpdateIngredientBodyType) => {
    if (updateIngredientMutation.isPending || !id) return
    try {
      const body = {
        ...values,
        quantity: values.quantity !== undefined ? Number(values.quantity) : undefined,
        expiration_date: values.expiration_date || undefined
      }
      const result = await updateIngredientMutation.mutateAsync({
        ...body,
        id
      })
      toast.success(result.payload.message || 'Cập nhật nguyên liệu thành công!')
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
      <DialogContent className='sm:max-w-[425px] max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nguyên liệu</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Name field */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-ingredient-name">Tên nguyên liệu</FieldLabel>
                  <Input
                    {...field}
                    id="edit-ingredient-name"
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
                  <FieldLabel htmlFor="edit-ingredient-quantity">Số lượng</FieldLabel>
                  <Input
                    {...field}
                    id="edit-ingredient-quantity"
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
                  <FieldLabel htmlFor="edit-ingredient-exp">Ngày hết hạn</FieldLabel>
                  <Input
                    {...field}
                    id="edit-ingredient-exp"
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
                reset()
              }}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateIngredientMutation.isPending}>
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
