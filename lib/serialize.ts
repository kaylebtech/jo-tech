/** Prisma Decimal fields aren't plain-serializable across the RSC boundary — convert to number|null. */
export function serializeProduct<T extends { price: unknown; compareAtPrice: unknown }>(
  product: T
): Omit<T, "price" | "compareAtPrice"> & { price: number | null; compareAtPrice: number | null } {
  return {
    ...product,
    price: product.price === null || product.price === undefined ? null : Number(product.price),
    compareAtPrice:
      product.compareAtPrice === null || product.compareAtPrice === undefined
        ? null
        : Number(product.compareAtPrice),
  };
}
