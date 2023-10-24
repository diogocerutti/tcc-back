import { checkSchema } from "express-validator";

export const productValidator = checkSchema({
  name: {
    isLength: {
      options: {
        min: 5,
      },
      errorMessage: "Nome muito curto.",
    },
  },
});
