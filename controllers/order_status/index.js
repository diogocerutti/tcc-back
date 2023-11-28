import db from "../../lib/prisma.js";
import {
  findExistingOrderStatus,
  findOrderStatusById,
} from "../../services/order_status.js";

export const getAllOrderStatus = async (req, res) => {
  try {
    const orderStatus = await db.order_status.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const orderStatusFormat = JSON.stringify(orderStatus, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(orderStatusFormat);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOneOrderStatus = async (req, res) => {
  try {
    const orderStatus = await db.order_status.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (orderStatus === null) {
      throw new Error("Order status not found.");
    }

    const orderStatusFormat = JSON.stringify(orderStatus, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(orderStatusFormat);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      throw new Error("Status is mandatory.");
    }

    const existingStatus = await findExistingOrderStatus(status);

    if (existingStatus) {
      throw new Error("Status already exists.");
    }

    const orderStatus = await db.order_status.create({
      data: {
        status,
      },
    });

    Object.keys(orderStatus).forEach((item) => {
      if (typeof orderStatus[item] === "bigint") {
        orderStatus[item] = orderStatus[item].toString();
      }
    });

    res.status(200).send(orderStatus);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      throw new Error("Todos os campos são obrigatórios!");
    }

    const existingStatus = await findOrderStatusById(req.params.id);

    if (!existingStatus) {
      throw new Error("Order status not found.");
    }

    const existingStatusName = await findExistingOrderStatus(status);

    if (existingStatusName) {
      if (Number(existingStatusName.id) !== Number(req.params.id)) {
        throw new Error("Status já existe!");
      }
    }

    const updatedStatus = await db.order_status.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: status,
      },
    });

    Object.keys(updatedStatus).forEach((item) => {
      if (typeof updatedStatus[item] === "bigint") {
        updatedStatus[item] = updatedStatus[item].toString();
      }
    });

    res.status(200).send(updatedStatus);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteOrderStatus = async (req, res) => {
  try {
    const existingStatus = await findOrderStatusById(req.params.id);

    if (!existingStatus) {
      //res.status(404); não funcionou?
      throw new Error("Order status not found.");
    }

    const existingStatusInOrder = await db.order.findFirst({
      where: {
        id_status: { equals: req.params.id },
      },
    });

    if (existingStatusInOrder) {
      throw new Error(
        "Impossível excluir. O status está sendo usado em algum pedido."
      );
    }

    const orderStatus = await db.order_status.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    Object.keys(orderStatus).forEach((item) => {
      if (typeof orderStatus[item] === "bigint") {
        orderStatus[item] = orderStatus[item].toString();
      }
    });

    res
      .status(200)
      .json(`Status de pedido "${orderStatus.status.valueOf()}" removido`);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
