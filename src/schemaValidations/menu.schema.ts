import z from "zod";

export const CreateMenuBody = z.object({
  menu_name: z.string().min(1).max(256),
  description: z.string().max(10000).optional(),
});
export type CreateMenuBodyType = z.TypeOf<typeof CreateMenuBody>;

export const UpdateMenuBody = CreateMenuBody.partial();
export type UpdateMenuBodyType = z.TypeOf<typeof UpdateMenuBody>;

export const MenuSchema = z.object({
  _id: z.string(),
  menu_name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MenuRes = z.object({
  data: MenuSchema,
  message: z.string(),
});
export type MenuResType = z.TypeOf<typeof MenuRes>;

export const MenuListRes = z.object({
  data: z.array(MenuSchema),
  message: z.string(),
});
export type MenuListResType = z.TypeOf<typeof MenuListRes>;

export const MenuParams = z.object({
  id: z.string(),
});
export type MenuParamsType = z.TypeOf<typeof MenuParams>;
