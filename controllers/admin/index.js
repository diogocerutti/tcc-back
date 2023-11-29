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
      throw new Error("You must provide an email and a password.");
    }

    const existingAdmin = await findAdminByEmail(email);

    if (!existingAdmin) {
      throw new Error("Invalid login credentials.");
    }

    const validPassword = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!validPassword) {
      throw new Error("Invalid login credentials. (SENHA)");
    }

    Object.keys(existingAdmin).forEach((item) => {
      if (typeof existingAdmin[item] === "bigint") {
        existingAdmin[item] = existingAdmin[item].toString();
      }
    });

    const token = jwt.sign({ existingAdmin }, process.env.SECRET, {
      expiresIn: "1d",
    });

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
      orderBy: {
        id: "asc",
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

    if (response == null) {
      throw new Error("Admin not found.");
    }

    const responseFormat = JSON.stringify(response, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(responseFormat);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { username, name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword || !username) {
      throw new Error("Todos os campos são obrigatórios!");
    }

    const existingAdmin = await findAdminByEmail(email);

    if (existingAdmin) {
      throw new Error("E-mail já está em uso!");
    }

    if (password !== confirmPassword) {
      throw new Error("Senha e confirmação devem ser iguais!");
    }

    const admin = await db.admin.create({
      data: {
        username,
        name,
        email,
        password: await hash(confirmPassword, 12),
        status: true,
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

export const updateAdmin = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      newPassword,
      confirmPassword,
      status,
    } = req.body;

    if (!name || !email || !password || !username) {
      throw new Error("Todos os campos são obrigatórios!");
    }

    const existingAdmin = await findAdminById(req.params.id);

    if (!existingAdmin) {
      throw new Error("Admin not found.");
    }

    const existingEmail = await findAdminByEmail(email);

    if (existingEmail) {
      Object.keys(existingEmail).forEach((item) => {
        if (typeof existingEmail[item] === "bigint") {
          existingEmail[item] = existingEmail[item].toString();
        }
      });

      if (existingEmail.id !== req.params.id) {
        throw new Error("E-mail já está em uso!");
      }
    }

    const validPassword = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!validPassword) {
      throw new Error("Senha inválida!");
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        throw new Error("Nova senha e confirmação precisam ser iguais!");
      }
    }

    const admin = await db.admin.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        username: username,
        name: name,
        email: email,
        password: confirmPassword
          ? await hash(confirmPassword, 12)
          : await hash(password, 12),
        status: status,
      },
    });

    Object.keys(admin).forEach((item) => {
      if (typeof admin[item] === "bigint") {
        admin[item] = admin[item].toString();
      }
    });

    res.status(200).send(admin);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const existingAdmin = await findAdminById(req.params.id);

    if (!existingAdmin) {
      throw new Error("Admin not found.");
    }

    const admin = await db.admin.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json(`Usuário "${admin.name}" removido!`);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
