import db from "../../lib/prisma.js";
import { findOrderById } from "../../services/order.js";
import { findManyProducts } from "../../services/product.js";
import { findUserById } from "../../services/user.js";
import { findUserAddressByIdUser } from "../../services/user_address.js";
import { findPaymentTypeById } from "../../services/payment_type.js";
import { findOrderStatusById } from "../../services/order_status.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await db.order.findMany({
      select: {
        id: true,
        total: true,
        date: true,
        hour: true,
        id_status: true,
        user_payment_relation: {
          select: {
            payment_type_relation: {
              select: {
                type: true,
              },
            },
          },
        },
        order_items_relation: {
          select: {
            quantity: true,
            product_relation: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
        order_status_relation: {
          select: {
            status: true,
          },
        },
        user_relation: {
          select: {
            name: true,
            phone: true,
            user_address_relation: {
              select: {
                address: true,
                city: true,
                postal_code: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    const ordersFormat = JSON.stringify(orders, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(ordersFormat);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const orders = await db.order.findMany({
      where: {
        id_user: Number(req.params.id_user),
      },
      select: {
        id: true,
        total: true,
        date: true,
        hour: true,
        order_status_relation: {
          select: {
            status: true,
          },
        },
        user_relation: {
          select: {
            name: true,
            user_address_relation: {
              select: {
                address: true,
                city: true,
                postal_code: true,
              },
            },
          },
        },
        order_items_relation: {
          select: {
            quantity: true,
            product_relation: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

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
    const { products, date, hour, id_payment_type } = req.body;

    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const existingProduct = await findManyProducts(
      products.map((p) => Number(p.id_product))
    );

    if (existingProduct.length !== products.length) {
      throw new Error("Products not found.");
    }

    const existingPaymentType = await findPaymentTypeById(id_payment_type);

    if (!existingPaymentType) {
      throw new Error("Payment type not found.");
    }

    let quantityxPrice = [];
    let total;

    for (let i = 0; i < existingProduct.length; i++) {
      quantityxPrice[i] = existingProduct[i].price * products[i].quantity;
    }

    total = quantityxPrice.reduce((a, c) => a + c, 0);

    const userAddress = await findUserAddressByIdUser(req.params.id_user);

    if (!userAddress) {
      throw new Error("Endereço não encontrado!");
    }

    const order = await db.order.create({
      data: {
        total: total,
        date: date,
        hour: hour,
        address: userAddress.address,
        city: userAddress.city,
        postal_code: userAddress.postal_code,
        order_items_relation: {
          create: products,
        },
        user_relation: {
          connect: {
            id: req.params.id_user,
          },
        },
        order_status_relation: {
          connect: {
            id: 2, // Em preparação
          },
        },
        user_payment_relation: {
          create: {
            id_payment_type: id_payment_type,
          },
        },
      },
      include: {
        order_items_relation: true,
        user_relation: true,
        order_status_relation: true,
        user_payment_relation: true,
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
    const { id_status, date, hour } = req.body;

    const existingOrder = await findOrderById(req.params.id);

    if (!existingOrder) {
      throw new Error("Order not found.");
    }

    const existingOrderStatus = await findOrderStatusById(id_status);

    if (!existingOrderStatus) {
      throw new Error("Invalid order status.");
    }

    const updatedOrder = await db.order.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        date: date,
        hour: hour,
        id_status: id_status,
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
