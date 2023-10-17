import db from "../lib/prisma.js";

export function findAdminByEmail(email) {
  return db.admin.findUnique({
    where: {
      email,
    },
  });
}

export function findAdminById(id) {
  return db.admin.findUnique({
    where: {
      id,
    },
  });
}
