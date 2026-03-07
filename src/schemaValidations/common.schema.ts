import z from "zod";

export const MessageRes = z.object({
  message: z.string(),
});
export type MessageResType = z.TypeOf<typeof MessageRes>;

export const ApiErrorRes = z.object({
  message: z.string(),
  statusCode: z.number(),
  errors: z
    .array(
      z.object({
        code: z.string(),
        expected: z.string().optional(),
        received: z.string().optional(),
        path: z.array(z.string()),
        message: z.string(),
        field: z.string(),
      }),
    )
    .optional(),
});
export type ApiErrorResType = z.TypeOf<typeof ApiErrorRes>;
