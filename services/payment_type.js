import db from "../lib/prisma.js";

export function findExistingPaymentType(type) {
  return db.payment_type.findFirst({
    where: {
      type: type,
    },
  });
}

export function findPaymentTypeById(id) {
  return db.payment_type.findUnique({
    where: {
      id,
    },
  });
}
