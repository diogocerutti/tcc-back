import db from "../../lib/prisma.js";
import {
  findExistingCategory,
  findCategoryById,
} from "../../services/product_category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await db.product_category.findMany();

    const categoriesFormat = JSON.stringify(categories, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(categoriesFormat);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOneCategory = async (req, res) => {
  try {
    const category = await db.product_category.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (category == null) {
      throw new Error("Category not found.");
    }

    const categoryFormat = JSON.stringify(category, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(categoryFormat);
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

export const updateProductCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      throw new Error("Category is mandatory.");
    }

    const existingCategory = await findCategoryById(req.params.id);

    if (!existingCategory) {
      res.status(404);
      throw new Error("Category not found.");
    }

    const updatedCategory = await db.product_category.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        category: category,
      },
    });

    Object.keys(updatedCategory).forEach((item) => {
      if (typeof updatedCategory[item] === "bigint") {
        updatedCategory[item] = updatedCategory[item].toString();
      }
    });

    res.status(200).send(updatedCategory);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteProductCategory = async (req, res) => {
  try {
    const existingCategory = await findCategoryById(req.params.id);

    if (!existingCategory) {
      //res.status(404); não funcionou?
      throw new Error("Category not found.");
    }

    const category = await db.product_category.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    Object.keys(category).forEach((item) => {
      if (typeof category[item] === "bigint") {
        category[item] = category[item].toString();
      }
    });

    res
      .status(200)
      .json(`Categoria de produto "${category.category.valueOf()}" removida`);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
