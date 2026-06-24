'use client'

import { useEffect } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateMenuBody, UpdateMenuBodyType } from "@/schemaValidations/menu.schema"
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
import { useGetMenuDetail, useUpdateMenuMutation } from "@/queries/useMenu"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

interface Props {
  id: string | undefined
  setId: (value: string | undefined) => void
}

export default function EditMenu({ id, setId }: Props) {
  const updateMenuMutation = useUpdateMenuMutation()
  const { data } = useGetMenuDetail(id as string, Boolean(id))

  const form = useForm<UpdateMenuBodyType>({
    resolver: zodResolver(UpdateMenuBody) as any,
    defaultValues: {
      menu_name: '',
      description: ''
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (data?.payload?.data) {
      const menu = data.payload.data
      form.reset({
        menu_name: menu.menu_name || '',
        description: menu.description || ''
      })
    }
  }, [data, form])

  const reset = () => {
    setId(undefined)
  }

  const onSubmit = async (values: UpdateMenuBodyType) => {
    if (updateMenuMutation.isPending || !id) return
    try {
      const result = await updateMenuMutation.mutateAsync({
        ...values,
        id
      })
      toast.success(result.payload.message || 'Cập nhật danh mục thành công!')
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
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Menu Name */}
            <Controller
              name="menu_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-menu-name">Tên danh mục</FieldLabel>
                  <Input
                    {...field}
                    id="edit-menu-name"
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
                  <FieldLabel htmlFor="edit-menu-desc">Mô tả</FieldLabel>
                  <Textarea
                    {...field}
                    id="edit-menu-desc"
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
                reset()
              }}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateMenuMutation.isPending}>
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
