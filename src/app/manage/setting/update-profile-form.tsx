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

export default function UpdateProfileForm() {
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: undefined
    }
  })

  function onSubmit() {
    console.log("me")
  }

  return (
    <form
      noValidate
      className='grid auto-rows-max items-start gap-4 md:gap-8'
      onSubmit={form.handleSubmit(onSubmit)}
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
                    <Avatar className='aspect-square w-25 h-25 rounded-md object-cover'>
                      <AvatarImage src={'Duoc'} />
                      <AvatarFallback className='rounded-none'>{'duoc'}</AvatarFallback>
                    </Avatar>
                    <input type='file' accept='image/*' className='hidden' />
                    <button
                      className='flex aspect-square w-25 items-center justify-center rounded-md border border-dashed'
                      type='button'
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
              <Button size='sm' type='submit'>
                Lưu thông tin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}