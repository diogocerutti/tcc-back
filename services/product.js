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

export function findManyProducts(id) {
  return db.product.findMany({
    where: {
      id: { in: id },
    },
  });
}
