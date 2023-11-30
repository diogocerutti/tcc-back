import db from "../../lib/prisma.js";
import { findUserCreditCard } from "../../services/credit_card.js";
import { findUserById } from "../../services/user.js";

export const getUserCreditCard = async (req, res) => {
  try {
    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("Usuário não encontrado!");
    }

    const creditCard = await db.credit_card.findUnique({
      where: {
        id_user: Number(req.params.id_user),
      },
    });

    const creditCardFormat = JSON.stringify(creditCard, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    if (creditCard === null) {
      res.status(200).json({ msg: "Cartão não encontrado." });
    } else {
      res.status(200).send(creditCardFormat);
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createUserCreditCard = async (req, res) => {
  try {
    const { cpf, cvv, expire_date, name, number } = req.body;

    if (!cpf || !cvv || !expire_date || !name || !number) {
      throw new Error("Todos os campos são obrigatórios!");
    }

    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("Usuário não encontrado!");
    }

    const existingCreditCard = await findUserCreditCard(req.params.id_user);

    if (existingCreditCard) {
      throw new Error("Usuário já possui um cartão cadastrado!");
    }

    const credit_card = await db.credit_card.create({
      data: {
        cpf,
        cvv,
        expire_date,
        name,
        number,
        id_user: req.params.id_user,
      },
    });

    Object.keys(credit_card).forEach((item) => {
      if (typeof credit_card[item] === "bigint") {
        credit_card[item] = credit_card[item].toString();
      }
    });

    res.status(200).send(credit_card);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUserCreditCard = async (req, res) => {
  try {
    const { cpf, cvv, expire_date, name, number } = req.body;

    if (!cpf || !cvv || !expire_date || !name || !number) {
      throw new Error("Todos os campos são obrigatórios!");
    }

    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("Usuário não encontrado!");
    }

    const existingCreditCard = await findUserCreditCard(req.params.id_user);

    if (!existingCreditCard) {
      throw new Error("No Credit Cards found for this User!");
    }

    const updatedCreditCard = await db.credit_card.update({
      where: {
        id_user: Number(req.params.id_user),
      },
      data: {
        cpf: cpf,
        cvv: cvv,
        expire_date: expire_date,
        name: name,
        number: number,
      },
    });

    Object.keys(updatedCreditCard).forEach((item) => {
      if (typeof updatedCreditCard[item] === "bigint") {
        updatedCreditCard[item] = updatedCreditCard[item].toString();
      }
    });

    res.status(200).send(updatedCreditCard);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUserCreditCard = async (req, res) => {
  try {
    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("Usuário não encontrado!");
    }

    const existingCreditCard = await findUserCreditCard(req.params.id_user);

    if (!existingCreditCard) {
      throw new Error("Cartão de crédito não encontrado!");
    }

    const credit_card = await db.credit_card.delete({
      where: {
        id_user: Number(req.params.id_user),
      },
    });

    Object.keys(credit_card).forEach((item) => {
      if (typeof credit_card[item] === "bigint") {
        credit_card[item] = credit_card[item].toString();
      }
    });

    res.status(200).json("Cartão removido com sucesso!");
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
