'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChangePasswordBody, ChangePasswordBodyType } from "@/schemaValidations/account.schema"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useChangePasswordMutation } from "@/queries/useAccount"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

export default function ChangePasswordForm() {
  const changePasswordMutation = useChangePasswordMutation()

  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (values: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return
    try {
      const result = await changePasswordMutation.mutateAsync(values)
      toast.success(result.payload.message || 'Đổi mật khẩu thành công!')
      form.reset()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <form
      noValidate
      className='grid auto-rows-max items-start gap-4 md:gap-8'
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Card x-chunk='dashboard-07-chunk-0'>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">

            <Controller
              name="oldPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="old-password">
                    Mật khẩu cũ
                  </FieldLabel>
                  <Input
                    {...field}
                    id="old-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập mật khẩu hiện tại của bạn"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-password">
                    Mật khẩu mới
                  </FieldLabel>
                  <Input
                    {...field}
                    id="new-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-new-password">
                    Nhập lại mật khẩu mới
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirm-new-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Xác nhận lại mật khẩu mới"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className=' items-center gap-2 md:ml-auto flex'>
              <Button variant='outline' size='sm' type='reset' onClick={() => form.reset()}>
                Hủy
              </Button>
              <Button size='sm' type='submit' disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}