import db from "../lib/prisma.js";

export function findProductInOrder(id_product) {
  return db.order_items.findFirst({
    where: {
      id_product: id_product,
    },
  });
}

export function findProductsInOrder(id_product) {
  return db.order_items.findMany({
    where: {
      id_product: { in: id_product },
    },
  });
}
