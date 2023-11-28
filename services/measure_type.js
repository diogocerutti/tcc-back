import db from "../lib/prisma.js";

export function findExistingMeasure(measure) {
  return db.measure_type.findFirst({
    where: {
      measure: measure,
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
