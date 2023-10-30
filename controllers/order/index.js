import db from "../../lib/prisma.js";
import { findOrderById } from "../../services/order.js";
import { findProductById, findManyProducts } from "../../services/product.js";
import { findUserById } from "../../services/user.js";

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
        user_relation: {
          select: {
            name: true,
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
      if (orders[item].user_relation) {
        orders[item].user_relation = JSON.stringify(orders[item].user_relation);
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

export const getUserOrders = async (req, res) => {
  try {
    const orders = await db.order.findMany({
      where: {
        id_user: Number(req.params.id),
      },
    });

    const existingUser = await findUserById(req.params.id);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const ordersFormat = JSON.stringify(orders, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(ordersFormat);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const existingProduct = await findManyProducts(
      req.body.map((p) => Number(p.id_product))
    );

    if (existingProduct.length === 0) {
      throw new Error("Products not found.");
    }

    const calc =
      existingProduct.map((p) => p.price) * req.body.map((p) => p.quantity);

    console.log(calc);

    //const quantityxPrice = existingProduct.price * [quantity];

    /* const order = await db.order.create({
      data: {
        total: Number(quantityxPrice),
        order_items_relation: {
          create: req.body,
        },
        user_relation: {
          connect: {
            id: req.params.id_user,
          },
        },
        order_status_relation: {
          connect: {
            id: 1,
          },
        },
      },
      include: {
        order_items_relation: true,
        user_relation: true,
        order_status_relation: true,
      },
    });

    const orderFormat = JSON.stringify(order, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    ); */

    res.status(200).send("a");
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
