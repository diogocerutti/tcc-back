import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";

const prisma = new PrismaClient();

export const getAllAdmins = async (req, res) => {
  try {
    const response = await prisma.admin.findMany({
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
    const response = await prisma.admin.findUnique({
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
    const admin = await prisma.admin.create({
      data: {
        username,
        name,
        email,
        password: await hash(password, 12),
        status: true,
      },
    });
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
    const admin = await prisma.admin.update({
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
    const admin = await prisma.admin.delete({
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
