import db from "../../lib/prisma.js";
import { findUserById } from "../../services/user.js";
import { findUserAddressById } from "../../services/user_address.js";

export const createUserAddress = async (req, res) => {
  try {
    const { address, city, postal_code } = req.body;

    if (!address || !city || !postal_code) {
      throw new Error("All fields are required.");
    }

    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const user_address = await db.user_address.create({
      data: {
        address,
        city,
        postal_code,
        user_relation: {
          connect: { id: req.params.id_user },
        },
      },
      include: {
        user_relation: true,
      },
    });

    const user_addressFormat = JSON.stringify(user_address, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    res.status(200).send(user_addressFormat);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUserAddress = async (req, res) => {
  try {
    const { address, city, postal_code } = req.body;

    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const updatedAddress = await db.user_address.update({
      where: {
        id_user: req.params.id_user,
      },
      data: {
        address: address,
        city: city,
        postal_code: postal_code,
      },
    });

    Object.keys(updatedAddress).forEach((item) => {
      if (typeof updatedAddress[item] === "bigint") {
        updatedAddress[item] = updatedAddress[item].toString();
      }
    });

    res.status(200).send(updatedAddress);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUserAddress = async (req, res) => {
  try {
    const existingUser = await findUserById(req.params.id_user);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const addresses = await db.user_address.findUnique({
      where: {
        id_user: Number(req.params.id_user),
      },
    });

    const addressesFormat = JSON.stringify(addresses, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    if (addresses === null) {
      res.status(200).json({ msg: "Address not found." });
    } else {
      res.status(200).send(addressesFormat);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteUserAddress = async (req, res) => {
  try {
    const existingAddress = await findUserAddressById(req.params.id);

    if (!existingAddress) {
      throw new Error("Address not found.");
    }

    const address = await db.user_address.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    Object.keys(address).forEach((item) => {
      if (typeof address[item] === "bigint") {
        address[item] = address[item].toString();
      }
    });

    res.status(200).json(`Endereço removido.`);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
