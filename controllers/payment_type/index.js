import db from "../../lib/prisma.js";
import {
  findExistingPaymentType,
  findPaymentTypeById,
} from "../../services/payment_type.js";

export const createPaymentType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      throw new Error("Tipo de pagamento é obrigatório!");
    }

    const existingType = await findExistingPaymentType(type);

    if (existingType) {
      // cai aqui se for diferente de null
      throw new Error("Tipo de pagamento já existe!");
    }

    const payment_type = await db.payment_type.create({
      data: {
        type,
      },
    });

    Object.keys(payment_type).forEach((item) => {
      if (typeof payment_type[item] === "bigint") {
        payment_type[item] = payment_type[item].toString();
      }
    });

    res.status(200).send(payment_type);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updatePaymentType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      throw new Error("Tipo de pagamento é obrigatório!");
    }

    const existingType = await findPaymentTypeById(req.params.id);

    if (!existingType) {
      throw new Error("Payment type not found.");
    }

    const existingTypeName = await findExistingPaymentType(type);

    if (existingTypeName) {
      if (Number(existingTypeName.id) !== Number(req.params.id)) {
        throw new Error("Tipo de pagamento já existe!");
      }
    }

    const updatedType = await db.payment_type.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        type: type,
      },
    });

    Object.keys(updatedType).forEach((item) => {
      if (typeof updatedType[item] === "bigint") {
        updatedType[item] = updatedType[item].toString();
      }
    });

    res.status(200).send(updatedType);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getAllPaymentTypes = async (req, res) => {
  try {
    const types = await db.payment_type.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const typesFormat = JSON.stringify(types, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(typesFormat);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOnePaymentType = async (req, res) => {
  try {
    const type = await db.payment_type.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (type == null) {
      throw new Error("Payment type not found.");
    }

    const typeFormat = JSON.stringify(type, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(typeFormat);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const deletePaymentType = async (req, res) => {
  try {
    const existingType = await findPaymentTypeById(req.params.id);

    if (!existingType) {
      throw new Error("Payment type not found.");
    }

    const existingTypeInUserPayment = await db.user_payment.findFirst({
      where: {
        id_payment_type: { equals: req.params.id },
      },
    });

    if (existingTypeInUserPayment) {
      throw new Error(
        "Impossível excluir. O tipo de pagamento está sendo usado em algum pedido."
      );
    }

    const type = await db.payment_type.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    Object.keys(type).forEach((item) => {
      if (typeof type[item] === "bigint") {
        type[item] = type[item].toString();
      }
    });

    res
      .status(200)
      .json(`Tipo de pagamento "${type.type.valueOf()}" removido com sucesso.`);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
