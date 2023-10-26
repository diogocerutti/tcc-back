import db from "../lib/prisma.js";

export function findUserByEmail(email) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

export function findUserById(id) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}
