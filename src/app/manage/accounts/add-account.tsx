'use client'

import { useState, useMemo, useRef } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateEmployeeAccountBody, CreateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAddAccountMutation } from "@/queries/useAccount"
import { useUploadMediaMutation } from "@/queries/useMedia"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

export default function AddAccount() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  
  const addAccountMutation = useAddAccountMutation()
  const uploadMediaMutation = useUploadMediaMutation()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<CreateEmployeeAccountBodyType>({
    resolver: zodResolver(CreateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: undefined,
      password: '',
      confirmPassword: ''
    },
    mode: "onChange",
  })

  const avatar = form.watch('avatar')
  const name = form.watch('name')

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar || ''
  }, [file, avatar])

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (values: CreateEmployeeAccountBodyType) => {
    if (addAccountMutation.isPending) return
    try {
      let body = values
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageResult = await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = uploadImageResult.payload.data
        body = {
          ...values,
          avatar: imageUrl
        }
      }
      const result = await addAccountMutation.mutateAsync(body)
      toast.success(result.payload.message || 'Tạo tài khoản nhân viên thành công!')
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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo tài khoản</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-150 max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Tạo tài khoản nhân viên</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Avatar upload field */}
            <div className="flex gap-4 items-center justify-start py-2">
              <Avatar className="w-16 h-16 rounded-full border border-charcoal/10 object-cover">
                <AvatarImage src={previewAvatarFromFile} />
                <AvatarFallback>{name ? name.slice(0, 2).toUpperCase() : 'AV'}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFile(file)
                    form.setValue('avatar', URL.createObjectURL(file))
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => avatarInputRef.current?.click()}
                className="flex gap-2 items-center"
              >
                <Upload className="w-4 h-4" />
                Chọn ảnh đại diện
              </Button>
            </div>

            {/* Name field */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-name">Tên nhân viên</FieldLabel>
                  <Input
                    {...field}
                    id="account-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nguyen Van A"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="account-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="nv-a@lapizzaia.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-password">Mật khẩu</FieldLabel>
                  <Input
                    {...field}
                    id="account-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm password field */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-confirm-password">Xác nhận mật khẩu</FieldLabel>
                  <Input
                    {...field}
                    id="account-confirm-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            </DialogClose>
            <Button type='submit' disabled={addAccountMutation.isPending}>
              {addAccountMutation.isPending ? 'Đang tạo...' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
