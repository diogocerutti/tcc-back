import db from "../../lib/prisma.js";
import { findExistingCategory } from "../../services/product_category.js";

export const getAllAdmins = async (req, res) => {
  try {
    const response = await db.admin.findMany({
      where: {
        status: true, // somente ativos
      },
    });
    const responseFormat = JSON.stringify(response, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    res.status(200).send(responseFormat);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOneAdmin = async (req, res) => {
  try {
    const response = await db.admin.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    const responseFormat = JSON.stringify(response, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    res.status(200).send(responseFormat);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createProductCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      res.status(400);
      throw new Error("Category is mandatory.");
    }

    const existingCategory = await findExistingCategory(category);

    if (existingCategory) {
      // cai aqui se for diferente de null
      console.log(existingCategory);
      res.status(400);
      throw new Error("Category already exists.");
    }

    const product_category = await db.product_category.create({
      data: {
        category,
      },
    });

    Object.keys(product_category).forEach((item) => {
      if (typeof product_category[item] === "bigint") {
        product_category[item] = product_category[item].toString();
      }
    });

    res.status(200).send(product_category);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  const { username, name, email, password, status } = req.body;
  try {
    const admin = await db.admin.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        username: username,
        name: name,
        email: email,
        password: password,
        status: status,
      },
    });
    const adminFormat = JSON.stringify(admin, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    res.status(200).send(adminFormat);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await db.admin.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    const adminFormat = JSON.stringify(admin, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    res.status(200).json(`Usuário Admin de ID = ${admin.id} removido`);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
