import z from "zod";

export const LoginBody = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});
export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      _id: z.string(),
      username: z.string(),
      email: z.string(),
      role: z.enum(["Admin", "Employee", "User"]),
      avatar: z.string().nullable().optional(),
    }),
  }),
  message: z.string(),
});
export type LoginResType = z.TypeOf<typeof LoginRes>;

export const LogoutBody = z.object({
  refreshToken: z.string(),
});
export type LogoutBodyType = z.TypeOf<typeof LogoutBody>;

export const refreshTokenBody = z.object({
  refreshToken: z.string(),
});
export type refreshTokenBodyType = z.TypeOf<typeof refreshTokenBody>;

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});
export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>;
