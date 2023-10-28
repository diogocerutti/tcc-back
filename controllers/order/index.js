import db from "../../lib/prisma.js";
import { findOrderById } from "../../services/order.js";
import { findProductById } from "../../services/product.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await db.order.findMany({
      select: {
        id: true,
        total: true,
        order_status_relation: {
          select: {
            status: true,
          },
        },
      },
    });

    Object.keys(orders).forEach((item) => {
      if (orders[item].order_status_relation) {
        orders[item].order_status_relation = JSON.stringify(
          orders[item].order_status_relation
        );
      }
      for (const key in orders[item]) {
        if (typeof orders[item][key]) {
          orders[item][key] = orders[item][key].toString();
        }
      }
    });

    res.status(200).send(orders);
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

export const createOrder = async (req, res) => {
  try {
    const { id_product, quantity } = req.body;

    const existingProduct = await findProductById(id_product);

    if (!existingProduct) {
      throw new Error("Product not found.");
    }

    const quantityxPrice = existingProduct.price * quantity;

    const order = await db.order.create({
      data: {
        total: Number(quantityxPrice),
        order_items_relation: {
          create: [
            {
              id_product: id_product,
              quantity: quantity,
            },
          ],
        },
      },
      include: {
        order_items_relation: true,
      },
    });

    const orderFormat = JSON.stringify(order, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(orderFormat);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id_product, quantity } = req.body;

    const existingOrder = await findOrderById(req.params.id);

    if (!existingOrder) {
      throw new Error("Order not found.");
    }

    if (!id_product || !quantity) {
      throw new Error("All fields are mandatory.");
    }

    const existingProduct = await findProductById(id_product);

    if (!existingProduct) {
      throw new Error("Product not found.");
    }

    const quantityxPrice = existingProduct.price * quantity;

    const updatedOrder = await db.order.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        total: { increment: quantityxPrice },
        order_items_relation: {
          create: [
            {
              id_product: id_product,
              quantity: quantity,
            },
          ],
        },
      },
      include: {
        order_items_relation: true,
      },
    });

    const updatedOrderFormat = JSON.stringify(updatedOrder, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(updatedOrderFormat);
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
