import db from "../lib/prisma.js";

export function findExistingProduct(name) {
  return db.product.findFirst({
    where: {
      name: name,
    },
  });
}

export function findProductById(id) {
  return db.product.findUnique({
    where: {
      id,
    },
  });
}
