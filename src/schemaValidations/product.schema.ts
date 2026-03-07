import z from "zod";

export const ProductStatusValues = [
  "Available",
  "Unavailable",
  "Draft",
] as const;

export const CreateProductBody = z.object({
  product_name: z
    .string()
    .min(5, "Name product must be at least 5 characters.")
    .max(256, "Name product must be at most 256 characters."),
  menu_name: z
    .string()
    .min(5, "Menu product must be at least 5 characters.")
    .max(256, "Menu product must be at least 256 characters."),
  description: z.string().max(10000).optional(),
  image: z.string().optional(),
  size: z.string().optional(),
  status: z.enum(ProductStatusValues).optional(),
});
export type CreateProductBodyType = z.TypeOf<typeof CreateProductBody>;
export const UpdateProductBody = CreateProductBody.partial();
export type UpdateProductBodyType = z.TypeOf<typeof UpdateProductBody>;

export const ProductSchema = z.object({
  _id: z.string(),
  product_name: z.string(),
  price: z.coerce.number(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  size: z.string().nullable(),
  menu_name: z.string(),
  status: z.enum(ProductStatusValues),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProductRes = z.object({
  data: ProductSchema,
  message: z.string(),
});
export type ProductResType = z.TypeOf<typeof ProductRes>;

export const ProductListRes = z.object({
  data: z.array(ProductSchema),
  message: z.string(),
});
export type ProductListResType = z.TypeOf<typeof ProductListRes>;

export const ProductParams = z.object({
  id: z.coerce.number(),
});
export type ProductParamsType = z.TypeOf<typeof ProductParams>;
