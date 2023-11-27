import db from "../lib/prisma.js";

export function findUserCreditCard(id_user) {
  return db.credit_card.findUnique({
    where: {
      id_user: id_user,
    },
  });
}
