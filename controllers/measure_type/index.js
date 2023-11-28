import db from "../../lib/prisma.js";
import {
  findExistingMeasure,
  findMeasureById,
} from "../../services/measure_type.js";

export const getAllMeasures = async (req, res) => {
  try {
    const measures = await db.measure_type.findMany({
      orderBy: {
        id: "asc",
      },
    });

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
    const { measure } = req.body;

    if (!measure) {
      throw new Error("Unidade de medida é obrigatória!");
    }

    const existingMeasure = await findExistingMeasure(measure);

    if (existingMeasure) {
      // cai aqui se for diferente de null
      throw new Error("Unidade de medida já existe!");
    }

    const measure_type = await db.measure_type.create({
      data: {
        measure,
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
    const { measure } = req.body;

    if (!measure) {
      throw new Error("Unidade de medida é obrigatória!");
    }

    const existingMeasure = await findMeasureById(req.params.id);

    if (!existingMeasure) {
      throw new Error("Measure type not found.");
    }

    const existingMeasureName = await findExistingMeasure(measure);

    if (existingMeasureName) {
      if (Number(existingMeasureName.id) !== Number(req.params.id)) {
        throw new Error("Unidade de medida já existe!");
      }
    }

    const updatedMeasure = await db.measure_type.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        measure: measure,
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
      throw new Error("Measure type not found.");
    }

    const existingMeasureInProduct = await db.product.findFirst({
      where: {
        id_measure: { equals: req.params.id },
      },
    });

    if (existingMeasureInProduct) {
      throw new Error(
        "Impossível excluir. A unidade de medida está sendo usada em algum produto."
      );
    }

    const measure = await db.measure_type.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    Object.keys(measure).forEach((item) => {
      if (typeof measure[item] === "bigint") {
        measure[item] = measure[item].toString();
      }
    });

    res
      .status(200)
      .json(
        `Unidade de medida "${measure.measure.valueOf()}" removida com sucesso!`
      );
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
