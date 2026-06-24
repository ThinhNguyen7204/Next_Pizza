'use client'

import { useState } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateMenuBody, CreateMenuBodyType } from "@/schemaValidations/menu.schema"
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
import { useAddMenuMutation } from "@/queries/useMenu"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

export default function AddMenu() {
  const [open, setOpen] = useState(false)
  const addMenuMutation = useAddMenuMutation()

  const form = useForm<CreateMenuBodyType>({
    resolver: zodResolver(CreateMenuBody) as any,
    defaultValues: {
      menu_name: '',
      description: ''
    },
    mode: "onChange",
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateMenuBodyType) => {
    if (addMenuMutation.isPending) return
    try {
      const result = await addMenuMutation.mutateAsync(values)
      toast.success(result.payload.message || 'Thêm danh mục mới thành công!')
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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm danh mục</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px] max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Thêm danh mục mới</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Menu Name */}
            <Controller
              name="menu_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="menu-name-input">Tên danh mục</FieldLabel>
                  <Input
                    {...field}
                    id="menu-name-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: pizza, drink, dessert..."
                    autoComplete="off"
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
                  <FieldLabel htmlFor="menu-desc-input">Mô tả</FieldLabel>
                  <Textarea
                    {...field}
                    id="menu-desc-input"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập mô tả ngắn cho danh mục..."
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
            <Button type="submit" disabled={addMenuMutation.isPending}>
              Thêm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
