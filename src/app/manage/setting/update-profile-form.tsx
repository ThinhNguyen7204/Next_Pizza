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
import { UpdateMeBody, UpdateMeBodyType } from "@/schemaValidations/account.schema"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import { useAccountMe, useUpdateMeMutation } from "@/queries/useAccount"
import { useUploadMediaMutation } from "@/queries/useMedia"
import { useAuthStore } from "@/store"
import { useEffect, useRef, useState, useMemo } from "react"
import { toast } from "sonner"
import { handleErrorApi } from "@/lib/utils"

export default function UpdateProfileForm() {
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const { data, refetch } = useAccountMe()
  const updateMeMutation = useUpdateMeMutation()
  const uploadMediaMutation = useUploadMediaMutation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: undefined
    }
  })

  const avatar = form.watch('avatar')
  const name = form.watch('name')

  useEffect(() => {
    if (data?.payload?.data) {
      const me = data.payload.data
      form.reset({
        name: me.username || '',
        avatar: me.avatar || undefined
      })
    }
  }, [data, form])

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar || ''
  }, [file, avatar])

  const onSubmit = async (values: UpdateMeBodyType) => {
    if (updateMeMutation.isPending) return
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
      const result = await updateMeMutation.mutateAsync(body)
      toast.success(result.payload.message || 'Cập nhật thông tin thành công!')
      refetch()
      // Đồng bộ vào local store
      if (user && accessToken && refreshToken) {
        setAuth({ ...user, username: body.name, avatar: body.avatar }, accessToken, refreshToken)
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  const handleReset = () => {
    setFile(null)
    form.reset()
  }

  return (
    <form
      noValidate
      className='grid auto-rows-max items-start gap-4 md:gap-8'
      onSubmit={form.handleSubmit(onSubmit)}
      onReset={handleReset}
    >
      <Card x-chunk='dashboard-07-chunk-0'>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">

            <Controller
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <Field>
                  <div className='flex gap-2 items-start justify-start'>
                    <Avatar className='aspect-square w-25 h-25 rounded-md object-cover border border-charcoal/10'>
                      <AvatarImage src={previewAvatarFromFile} />
                      <AvatarFallback className='rounded-none'>{name ? name.slice(0, 2).toUpperCase() : 'AV'}</AvatarFallback>
                    </Avatar>
                    <input
                      type='file'
                      accept='image/*'
                      ref={avatarInputRef}
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setFile(file)
                          form.setValue('avatar', URL.createObjectURL(file))
                        }
                      }}
                    />
                    <button
                      className='flex aspect-square w-25 items-center justify-center rounded-md border border-dashed cursor-pointer hover:bg-charcoal/5 transition-colors'
                      type='button'
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <Upload className='h-4 w-4 text-muted-foreground' />
                      <span className='sr-only'>Upload</span>
                    </button>
                  </div>
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Tên
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Vui lòng nhập đầy đủ họ và tên"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className=' items-center gap-2 md:ml-auto flex'>
              <Button variant='outline' size='sm' type='reset'>
                Hủy
              </Button>
              <Button size='sm' type='submit' disabled={updateMeMutation.isPending}>
                {updateMeMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}