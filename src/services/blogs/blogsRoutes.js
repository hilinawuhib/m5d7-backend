import { Router } from "express";
import Database from "../../utils/fs-tools.js";
import blogValidationMiddlewares from "./validation.js";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import mime from "mime";
import multer from "multer";
import path from "path";

const upload = multer({
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image")) {
      // image/jpeg
      return callback(createHttpError(400, "Only image types are allowed!"));
    }
    return callback(null, true);
  },
});

const blogsRouter = Router();

const blogsDatabase = new Database("blogs.json");

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await blogsDatabase.all();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:id", async (req, res, next) => {
  try {
    const blog = await blogsDatabase.findObjectById(req.params.id);
    res.send(blog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  try {
    const blog = await blogsDatabase.updateObject(req.params.id, req.body);
    res.send(blog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  try {
    await blogsDatabase.deleteObject(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put(
  "/:id/image",
  upload.single("image"),
  async (req, res, next) => {
    try {
      const blog = await blogsDatabase.uploadImage(req.params.id, req.file);
      res.send(blog);
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.post("/", blogValidationMiddlewares, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const blog = await blogsDatabase.addObject(req.body);
      res.send(blog);
    } else {
      next(
        createHttpError(400, {
          message: "Blog validation is failed",
          errors: errors.array(),
        })
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;