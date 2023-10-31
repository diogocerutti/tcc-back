import db from "../../lib/prisma.js";
import { findOrderById } from "../../services/order.js";
import { findPaymentTypeById } from "../../services/payment_type.js";

export const createUserPayment = async (req, res) => {
  try {
    const { id_payment_type } = req.body;

    const existingOrder = await findOrderById(req.params.id_order);

    if (!existingOrder) {
      throw new Error("Order not found.");
    }

    if (!id_payment_type) {
      throw new Error("Payment type is required.");
    }

    const existingPaymentType = await findPaymentTypeById(id_payment_type);

    if (!existingPaymentType) {
      throw new Error("Payment type not found.");
    }

    const user_payment = await db.user_payment.create({
      data: {
        payment_type_relation: {
          connect: { id: Number(id_payment_type) },
        },
        order_relation: {
          connect: {
            id: req.params.id_order,
          },
        },
      },
      include: {
        payment_type_relation: true,
        order_relation: true,
      },
    });

    const updatedOrder = await db.order.update({
      where: {
        id: Number(req.params.id_order),
      },
      data: {
        /* total: { decrement: amount }, */
        id_status: 2, // em preparação!!
      },
    });

    Object.keys(user_payment).forEach((item) => {
      if (typeof user_payment[item] === "bigint") {
        user_payment[item] = user_payment[item].toString();
      }
      for (const key in user_payment[item]) {
        if (typeof user_payment[item][key] === "bigint") {
          user_payment[item][key] = user_payment[item][key].toString();
        }
      }
    });

    Object.keys(updatedOrder).forEach((item) => {
      if (typeof updatedOrder[item] === "bigint") {
        updatedOrder[item] = updatedOrder[item].toString();
      }
    });

    res.status(200).json({ user_payment, updatedOrder });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updatePaymentType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      throw new Error("Type is required");
    }

    const existingType = await findPaymentTypeById(req.params.id);

    if (!existingType) {
      throw new Error("Payment type not found.");
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
    const types = await db.payment_type.findMany();

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

    res.status(200).json(`Tipo de pagamento "${type.type.valueOf()}" removido`);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
