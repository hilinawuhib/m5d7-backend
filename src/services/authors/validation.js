import { body } from "express-validator";

const newAuthorValidation = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .isString(),
    
  body("lastName")
    .exists()
    .isString()
   
  ];

export default newAuthorValidation ;