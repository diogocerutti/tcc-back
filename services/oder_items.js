import db from "../lib/prisma.js";

export function findProductInOrder(id_product) {
  return db.order_items.findFirst({
    where: {
      id_product: id_product,
    },
  });
}
