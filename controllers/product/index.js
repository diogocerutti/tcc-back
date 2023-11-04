import db from "../../lib/prisma.js";
import {
  findExistingProduct,
  findProductById,
} from "../../services/product.js";
import { validationResult } from "express-validator";

export const getAllProducts = async (req, res) => {
  try {
    const products =
      await db.$queryRaw`SELECT product.id, name, price, description, image, id_category, id_measure, category, measure, status FROM product INNER JOIN product_category ON product.id_category=product_category.id INNER JOIN measure_type ON product.id_measure=measure_type.id`;

    Object.keys(products).forEach((item) => {
      for (const key in products[item]) {
        if (typeof products[item][key]) {
          products[item][key] = products[item][key].toString();
        }
      }
    });

    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: Number(req.params.id),
        status: true,
      },
    });

    if (product == null) {
      throw new Error("Product not found.");
    }

    const productFormat = JSON.stringify(product, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(productFormat);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, id_category, id_measure } = req.body;
    const { filename } = req.file;

    const existingProduct = await findExistingProduct(name);

    if (existingProduct) {
      // cai aqui se for diferente de null
      throw new Error("Product already exists.");
    }

    const result = validationResult(req);

    if (result.isEmpty()) {
      // se não houver erros
      const product = await db.product.create({
        data: {
          name: name,
          price: Number(price),
          description: description,
          image: filename,
          status: true,
          id_category: id_category,
          id_measure: id_measure,
        },
      });

      Object.keys(product).forEach((item) => {
        if (typeof product[item] === "bigint") {
          product[item] = product[item].toString();
        }
      });

      res.status(200).send(product);
    } else {
      res.send(result.errors.map((err) => err.msg));
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, id_measure, id_category, status } =
      req.body;
    const { filename } = req.file;

    const existingProductId = await findProductById(req.params.id);

    if (!existingProductId) {
      // cai aqui se for diferente de null
      throw new Error("Product not found.");
    }

    let statusFormat;

    if (status == "0") {
      statusFormat = false;
    }
    if (status == "1") {
      statusFormat = true;
    }

    const updatedProduct = await db.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: name,
        price: Number(price),
        description: description,
        id_category: id_category,
        id_measure: id_measure,
        status: statusFormat,
        image: filename,
      },
    });

    Object.keys(updatedProduct).forEach((item) => {
      if (typeof updatedProduct[item] === "bigint") {
        updatedProduct[item] = updatedProduct[item].toString();
      }
    });

    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
