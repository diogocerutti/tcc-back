import db from "../lib/prisma.js";

export function findExistingCategory(category) {
  return db.product_category.findFirst({
    where: {
      category: category,
    },
  });
}

export function findCategoryById(id) {
  return db.product_category.findUnique({
    where: {
      id,
    },
  });
}
