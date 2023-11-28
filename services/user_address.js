import db from "../lib/prisma.js";

export function findUserAddressById(id) {
  return db.user_address.findUnique({
    where: {
      id,
    },
  });
}

export function findUserAddressByIdUser(id_user) {
  return db.user_address.findUnique({
    where: {
      id_user,
    },
  });
}
