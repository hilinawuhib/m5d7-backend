import { body } from "express-validator";

const authorValidationMiddlewares = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be string")
    .isLength({ min: 2, max: 30 })
    .withMessage("Name has to be min 2 and max 30"),
  body("lastName")
    .exists()
    .isString()
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name has to be min 2 and max 30")
    .withMessage("Last name is required and must be string"),
  body("email")
    .exists()
    .isEmail()
    .withMessage("Email is required and must be a valid email")
    .custom((value, { req }) => {
      if (value.includes("hotmail.com")) {
        throw new Error("Email address is not valid");
      }
      return true;
    })
    .withMessage("You cant use invalid provider."),
];

export default authorValidationMiddlewares;