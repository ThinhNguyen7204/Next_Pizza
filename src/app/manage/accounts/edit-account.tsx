'use client'

import { useState, useMemo, useRef, useEffect } from "react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateEmployeeAccountBody, UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
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
import { useGetAccount, useUpdateAccountMutation } from "@/queries/useAccount"
import { useUploadMediaMutation } from "@/queries/useMedia"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Role } from "@/constants/type"

interface Props {
  id: string | undefined
  setId: (value: string | undefined) => void
}

export default function EditAccount({ id, setId }: Props) {
  const [file, setFile] = useState<File | null>(null)
  
  const updateAccountMutation = useUpdateAccountMutation()
  const uploadMediaMutation = useUploadMediaMutation()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const { data } = useGetAccount({
    id: id as string,
    enabled: Boolean(id)
  })

  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: undefined,
      role: Role.Sales,
      changePassword: false,
      password: '',
      confirmPassword: ''
    },
    mode: "onChange",
  })

  const avatar = form.watch('avatar')
  const name = form.watch('name')
  const changePassword = form.watch('changePassword')

  useEffect(() => {
    if (data?.payload?.data) {
      const accountData = data.payload.data
      form.reset({
        name: accountData.username || '',
        email: accountData.email || '',
        avatar: accountData.avatar || undefined,
        role: accountData.role || Role.Sales,
        changePassword: false,
        password: '',
        confirmPassword: ''
      })
    }
  }, [data, form])

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar || ''
  }, [file, avatar])

  const reset = () => {
    setFile(null)
    setId(undefined)
  }

  const onSubmit = async (values: UpdateEmployeeAccountBodyType) => {
    if (updateAccountMutation.isPending || !id) return
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
      // Gửi mutation với id nhân viên
      const result = await updateAccountMutation.mutateAsync({
        ...body,
        id
      })
      toast.success(result.payload.message || 'Cập nhật tài khoản nhân viên thành công!')
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
      <DialogContent className='sm:max-w-150 max-h-screen overflow-auto'>
        <form
          noValidate
          className="grid auto-rows-max items-start gap-4 md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tài khoản nhân viên</DialogTitle>
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
                  <FieldLabel htmlFor="edit-account-name">Tên nhân viên</FieldLabel>
                  <Input
                    {...field}
                    id="edit-account-name"
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
                  <FieldLabel htmlFor="edit-account-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="edit-account-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="nv-a@lapizzaia.com"
                    autoComplete="off"
                    disabled
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Role Select field */}
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-account-role">Vai trò</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Role.Sales}>Bán hàng (Sales)</SelectItem>
                      <SelectItem value={Role.CustomerSupport}>Hỗ trợ khách hàng</SelectItem>
                      <SelectItem value={Role.Kitchen}>Nhà bếp</SelectItem>
                      <SelectItem value={Role.Delivery}>Giao hàng</SelectItem>
                      <SelectItem value={Role.Manager}>Quản lý</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Change password checkbox */}
            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="change-password-checkbox"
                checked={changePassword}
                onChange={(e) => form.setValue('changePassword', e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <label htmlFor="change-password-checkbox" className="text-sm text-foreground font-medium cursor-pointer">
                Đổi mật khẩu tài khoản này
              </label>
            </div>

            {changePassword && (
              <>
                {/* Password field */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="edit-account-password">Mật khẩu mới</FieldLabel>
                      <Input
                        {...field}
                        id="edit-account-password"
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
                      <FieldLabel htmlFor="edit-account-confirm-password">Xác nhận mật khẩu mới</FieldLabel>
                      <Input
                        {...field}
                        id="edit-account-confirm-password"
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
              </>
            )}
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={reset}>Hủy</Button>
            </DialogClose>
            <Button type='submit' disabled={updateAccountMutation.isPending}>
              {updateAccountMutation.isPending ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
