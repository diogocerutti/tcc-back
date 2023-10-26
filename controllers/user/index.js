import db from "../../lib/prisma.js";
import { findUserByEmail, findUserById } from "../../services/user.js";
import bcrypt, { compare, hash } from "bcrypt";
//import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("You must provide an email and a password.");
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      throw new Error("Invalid login credentials.");
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      throw new Error("Invalid login credentials. (SENHA)");
    }

    Object.keys(existingUser).forEach((item) => {
      if (typeof existingUser[item] === "bigint") {
        existingUser[item] = existingUser[item].toString();
      }
    });

    const token = jwt.sign({ existingUser }, process.env.SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ existingUser, token });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const response = await db.user.findMany();

    Object.keys(response).forEach((item) => {
      for (const key in response[item]) {
        if (typeof response[item][key]) {
          response[item][key] = response[item][key].toString();
        }
      }
    });

    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const response = await db.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (response == null) {
      throw new Error("User not found.");
    }

    const responseFormat = JSON.stringify(response, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(responseFormat);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new Error("Email already in use.");
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password: await hash(password, 12),
        phone,
      },
    });

    Object.keys(user).forEach((item) => {
      if (typeof user[item] === "bigint") {
        user[item] = user[item].toString();
      }
    });

    res.status(200).send(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await findUserById(req.params.id);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const existingEmail = await findUserByEmail(email);

    if (existingEmail) {
      throw new Error("Email already in use.");
    }

    const user = await db.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: name,
        email: email,
        password: await hash(password, 12),
        phone: phone,
      },
    });

    Object.keys(user).forEach((item) => {
      if (typeof user[item] === "bigint") {
        user[item] = user[item].toString();
      }
    });

    res.status(200).send(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const existingUser = await findUserById(req.params.id);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const user = await db.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    Object.keys(user).forEach((item) => {
      if (typeof user[item] === "bigint") {
        user[item] = user[item].toString();
      }
    });

    res.status(200).json(`Usuário de ID = ${user.id} removido`);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
