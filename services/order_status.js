import db from "../lib/prisma.js";

export function findExistingOrderStatus(status) {
  return db.order_status.findFirst({
    where: {
      status: status,
    },
  });
}

export function findOrderStatusById(id) {
  return db.order_status.findUnique({
    where: {
      id,
    },
  });
}
