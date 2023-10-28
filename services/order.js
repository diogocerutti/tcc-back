import db from "../lib/prisma.js";

export function findOrderById(id) {
  return db.order.findUnique({
    where: {
      id,
    },
  });
}
