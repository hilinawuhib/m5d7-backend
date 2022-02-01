import { Router } from "express";
import Database from "../../utils/fs-tools.js";
import authorValidationMiddlewares from "./validation.js";
import { validationResult } from "express-validator";
import createError from "http-errors";
import multer from "multer";

const upload = multer();
const authorsRouter = Router();

const authorsDatabase = new Database("authors.json");

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await authorsDatabase.all();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:id", async (req, res, next) => {
  try {
    const blog = await authorsDatabase.findObjectById(req.params.id);
    res.send(blog);
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:id", async (req, res, next) => {
  try {
    const blog = await authorsDatabase.updateObject(req.params.id, req.body);
    res.send(blog);
  } catch (error) {
    next(error);
  }
});

authorsRouter.put(
  "/:id/image",
  upload.single("image"),
  async (req, res, next) => {
    try {
      const blog = await authorsDatabase.uploadImage(req.params.id, req.file);
      res.send(blog);
    } catch (error) {
      next(error);
    }
  }
);

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    await authorsDatabase.deleteObject(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

authorsRouter.post("/", authorValidationMiddlewares, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const blog = await authorsDatabase.addObject(req.body);
      res.send(blog);
    } else {
      next(
        createError(400, {
          message: "Authors validation is failed",
          errors: errors.array(),
        })
      );
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;