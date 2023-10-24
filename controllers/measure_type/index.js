import db from "../../lib/prisma.js";
import {
  findExistingMeasure,
  findMeasureById,
} from "../../services/measure_type.js";

export const getAllMeasures = async (req, res) => {
  try {
    const measures = await db.measure_type.findMany();

    const measuresFormat = JSON.stringify(measures, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(measuresFormat);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOneMeasure = async (req, res) => {
  try {
    const measure = await db.measure_type.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (measure == null) {
      throw new Error("Measure not found.");
    }

    const measureFormat = JSON.stringify(measure, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(measureFormat);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createMeasureType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      res.status(400);
      throw new Error("Type is mandatory.");
    }

    const existingMeasure = await findExistingMeasure(type);

    if (existingMeasure) {
      // cai aqui se for diferente de null
      throw new Error("Measure already exists.");
    }

    const measure_type = await db.measure_type.create({
      data: {
        type,
      },
    });

    Object.keys(measure_type).forEach((item) => {
      if (typeof measure_type[item] === "bigint") {
        measure_type[item] = measure_type[item].toString();
      }
    });

    res.status(200).send(measure_type);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateMeasureType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      throw new Error("Type is mandatory.");
    }

    const existingMeasure = await findMeasureById(req.params.id);

    if (!existingMeasure) {
      res.status(404);
      throw new Error("Measure type not found.");
    }

    const updatedMeasure = await db.measure_type.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        type: type,
      },
    });

    Object.keys(updatedMeasure).forEach((item) => {
      if (typeof updatedMeasure[item] === "bigint") {
        updatedMeasure[item] = updatedMeasure[item].toString();
      }
    });

    res.status(200).send(updatedMeasure);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteMeasureType = async (req, res) => {
  try {
    const existingMeasure = await findMeasureById(req.params.id);

    if (!existingMeasure) {
      //res.status(404); não funcionou?
      throw new Error("Measure type not found.");
    }

    const type = await db.measure_type.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    Object.keys(type).forEach((item) => {
      if (typeof type[item] === "bigint") {
        type[item] = type[item].toString();
      }
    });

    res.status(200).json(`Tipo de medida "${type.type.valueOf()}" removido`);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
