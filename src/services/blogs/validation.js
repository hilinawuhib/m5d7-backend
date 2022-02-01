import { body } from "express-validator";

const categories = ["TECH", "SPORTS", "HEALTH"];

const blogValidationMiddlewares = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be string")
    .withMessage("Title has to be min 20 and max 30"),
  body("content")
    .exists()
    .isString()
    .withMessage("Content is required and must be string"),
  body("category")
    .exists()
    .isString()
    .withMessage("Category is required and must be string")
    .custom((value, { req }) => {
      if (!categories.includes(value)) {
        throw new Error(
          "Invalid category, category must be one of ",
          categories.join(",")
        );
      }
      return true;
    }),
  body("author.name")
    .exists()
    .isString()
    .withMessage("Author name is required"),
  body("author.avatar")
    .exists()
    .isString()
    .withMessage("Author avatar is required"),
];

export default blogValidationMiddlewares;
