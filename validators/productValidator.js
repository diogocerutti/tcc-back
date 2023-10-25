import { checkSchema } from "express-validator";

export const productValidator = checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Nome não pode ser vazio.",
    },
  },
});
