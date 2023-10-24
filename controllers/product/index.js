import db from "../../lib/prisma.js";
import {
  findExistingProduct,
  findProductById,
} from "../../services/product.js";
import { uploadImage } from "../../utils/cloudinary.js";
import { validationResult } from "express-validator";

export const getAllProducts = async (req, res) => {
  try {
    const products = await db.products.findMany();

    const productsFormat = JSON.stringify(products, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(productsFormat);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: Number(req.params.id),
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

    const existingProduct = await findExistingProduct(name);

    if (existingProduct) {
      // cai aqui se for diferente de null
      throw new Error("Product already exists.");
    }

    const result = validationResult(req);

    if (result) {
      return res.send(result);
    }

    const product = await db.product.create({
      data: {
        name: name,
        price: price,
        /* image: "file:///C:/Users/diogo/OneDrive/Imagens/Capturar.png", */
        description: description,
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
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
