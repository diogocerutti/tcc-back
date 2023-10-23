import db from "../../lib/prisma.js";
import { findAdminByEmail, findAdminById } from "../../services/admin.js";
import bcrypt, { compare, hash } from "bcrypt";
//import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("You must provide an email and a password.");
    }

    const existingAdmin = await findAdminByEmail(email);

    if (!existingAdmin) {
      res.status(400);
      throw new Error("Invalid login credentials.");
    }

    const validPassword = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!validPassword) {
      res.status(403);
      throw new Error("Invalid login credentials. (SENHA)");
    }

    /*const adminFormat = JSON.stringify(existingAdmin, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );*/

    Object.keys(existingAdmin).forEach((item) => {
      if (typeof existingAdmin[item] === "bigint") {
        existingAdmin[item] = existingAdmin[item].toString();
      }
    });

    const token = jwt.sign({ existingAdmin }, process.env.SECRET, {
      expiresIn: "1d",
    });

    /*  res.setHeader(
      "Set-Cookie",
      cookie.serialize("admin", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60,
        sameSite: "strict",
        path: "/",
      })
    ); */

    res.status(200).json({ existingAdmin, token });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

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

export const createAdmin = async (req, res) => {
  const { username, name, email, password } = req.body;
  try {
    const admin = await db.admin.create({
      data: {
        username,
        name,
        email,
        password: await hash(password, 12),
        status: true,
      },
    });

    const existingAdmin = await findAdminByEmail(email);

    if (existingAdmin) {
      res.status(400);
      throw new Error("Email already in use.");
    }

    const adminFormat = JSON.stringify(admin, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    res.status(201).send(adminFormat);
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
