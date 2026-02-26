import z from "zod";

export const CreateProductBody = z.object({
  name: z
    .string()
    .min(5, "Name product must be at least 5 characters.")
    .max(256, "Name product must be at most 256 characters."),
  menu: z
    .string()
    .min(5, "Menu product must be at least 5 characters.")
    .max(256, "Menu product must be at least 256 characters."),
  description: z.string().max(10000),
  image: z.string().nullable(),
  // image: z.string().optional(),
});

export type CreateProductBodyType = z.TypeOf<typeof CreateProductBody>;

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  menu: z.string(),
  description: z.string(),
  sizePrice: z.string(),
  image: z.string(),
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

export const UpdateProductBody = CreateProductBody;
export type UpdateProductBodyType = CreateProductBodyType;

export const ProductParams = z.object({
  id: z.coerce.number(),
});
export type ProductParamsType = z.TypeOf<typeof ProductParams>;
