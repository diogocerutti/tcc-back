import db from "../lib/prisma.js";

export function findExistingMeasure(type) {
  return db.measure_type.findFirst({
    where: {
      type: type,
    },
  });
}

export function findMeasureById(id) {
  return db.measure_type.findUnique({
    where: {
      id,
    },
  });
}
