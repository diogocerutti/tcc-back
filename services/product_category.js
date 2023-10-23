import db from "../lib/prisma.js";

export function findExistingCategory(category) {
  return db.product_category.findFirstOrThrow({
    where: {
      category,
    },
  });
}
