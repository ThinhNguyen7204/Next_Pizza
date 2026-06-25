'use client'

import { useState, useRef, useEffect, useMemo } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateProductBody, UpdateProductBodyType } from "@/schemaValidations/product.schema"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetProductQuery, useUpdateProductMutation } from "@/queries/useProduct"
import { useUploadMediaMutation } from "@/queries/useMedia"
import { useGetMenuList } from "@/queries/useMenu"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductStatus } from "@/constants/type"

interface Props {
  id: string | undefined
  setId: (value: string | undefined) => void
}

export default function EditProduct({ id, setId }: Props) {
  const [file, setFile] = useState<File | null>(null)

  const updateProductMutation = useUpdateProductMutation()
  const uploadMediaMutation = useUploadMediaMutation()
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  // Lấy danh sách menu từ API
  const { data: menuListRes } = useGetMenuList()
  const menuList = menuListRes?.payload?.data || []

  const isPending = updateProductMutation.isPending || uploadMediaMutation.isPending

  const { data } = useGetProductQuery({
    id: id as string,
    enabled: Boolean(id)
  })

  const form = useForm<UpdateProductBodyType>({
    resolver: zodResolver(UpdateProductBody) as any,
    defaultValues: {
      product_name: '',
      price: 0,
      description: '',
      image: undefined,
      size: 'M',
      menu_name: '',
      status: ProductStatus.Available
    },
    mode: "onChange",
  })

  const image = form.watch('image')
  const productName = form.watch('product_name')

  useEffect(() => {
    if (data?.payload?.data) {
      const product = data.payload.data
      form.reset({
        product_name: product.product_name || '',
        price: product.price || 0,
        description: product.description || '',
        image: product.image || undefined,
        size: product.size || 'M',
        menu_name: product.menu_name || '',
        status: product.status || ProductStatus.Available
      })
    }
  }, [data, form])

  const previewImageFromFile = useMemo(() => {
    if (file) return URL.createObjectURL(file)
    return image || null
  }, [file, image])

  const reset = () => {
    setFile(null)
    setId(undefined)
  }

  const onSubmit = async (values: UpdateProductBodyType) => {
    // Guard: chặn double submit
    if (isPending || !id) return
    try {
      let body = values
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageResult = await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = uploadImageResult.payload.data
        body = { ...values, image: imageUrl }
      }
      const result = await updateProductMutation.mutateAsync({ ...body, id })
      toast.success(result.payload.message || 'Cập nhật món ăn thành công!')
      reset()
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Dialog open={Boolean(id)} onOpenChange={(val) => {
      if (!val) reset()
    }}>
      <DialogContent className='sm:max-w-150 max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Chỉnh sửa món ăn</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Image upload */}
            <div className="flex gap-4 items-center justify-start py-2">
              <Avatar className="w-20 h-20 rounded border border-charcoal/10 object-cover">
                {/* Fix: chỉ render AvatarImage khi có src thực */}
                {previewImageFromFile && <AvatarImage src={previewImageFromFile} />}
                <AvatarFallback className="rounded-none">
                  {productName ? productName.slice(0, 2).toUpperCase() : 'IMG'}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setFile(f)
                    form.setValue('image', URL.createObjectURL(f))
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                className="flex gap-2 items-center"
              >
                <Upload className="w-4 h-4" />
                Chọn ảnh món ăn
              </Button>
            </div>

            {/* Tên món ăn */}
            <Controller
              name="product_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-product-name">Tên món ăn</FieldLabel>
                  <Input {...field} id="edit-product-name" placeholder="Ví dụ: Pizza Hải Sản" autoComplete="off" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Giá bán */}
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-product-price">Giá bán (VND)</FieldLabel>
                  <Input
                    {...field}
                    id="edit-product-price"
                    type="number"
                    placeholder="Ví dụ: 120000"
                    autoComplete="off"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Kích thước */}
            <Controller
              name="size"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-product-size">Kích thước (Size)</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn kích thước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">S — Nhỏ</SelectItem>
                      <SelectItem value="M">M — Vừa</SelectItem>
                      <SelectItem value="L">L — Lớn</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Danh mục — lấy từ API */}
            <Controller
              name="menu_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-product-menu">Danh mục</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuList.length > 0 ? (
                        menuList.map((menu: any) => (
                          <SelectItem key={menu._id} value={menu.menu_name}>
                            {menu.menu_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="_none" disabled>Chưa có danh mục nào</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Trạng thái */}
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-product-status">Trạng thái</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProductStatus.Available}>Có sẵn</SelectItem>
                      <SelectItem value={ProductStatus.Unavailable}>Hết hàng</SelectItem>
                      <SelectItem value={ProductStatus.Hidden}>Ẩn</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Mô tả */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-product-description">Mô tả món ăn</FieldLabel>
                  <Input
                    {...field}
                    id="edit-product-description"
                    placeholder="Nhập mô tả chi tiết nguyên liệu, hương vị..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={reset}>Hủy</Button>
            </DialogClose>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}