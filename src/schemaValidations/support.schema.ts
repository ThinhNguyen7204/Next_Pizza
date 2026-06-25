import z from 'zod'

export const CreateSupportBody = z.object({
  name: z.string().min(1).max(256),
  email: z.string().email().min(1).max(256),
  phone: z.string().max(30).optional().or(z.literal('')),
  category: z.string().min(1).max(100),
  message: z.string().min(1).max(10000)
})
export type CreateSupportBodyType = z.TypeOf<typeof CreateSupportBody>

export const SupportReplySchema = z.object({
  sender: z.enum(['Admin', 'Customer']),
  content: z.string().min(1).max(10000),
  timestamp: z.string()
})

export const UpdateSupportBody = z.object({
  status: z.enum(['Pending', 'Processing', 'Resolved']).optional(),
  replies: z.array(SupportReplySchema).optional()
})
export type UpdateSupportBodyType = z.TypeOf<typeof UpdateSupportBody>

export const SupportRes = z.object({ data: z.any(), message: z.string() })
export type SupportResType = z.TypeOf<typeof SupportRes>

export const SupportListRes = z.object({ data: z.array(z.any()), message: z.string() })
export type SupportListResType = z.TypeOf<typeof SupportListRes>

export const SupportParams = z.object({ id: z.string() })
export type SupportParamsType = z.TypeOf<typeof SupportParams>
