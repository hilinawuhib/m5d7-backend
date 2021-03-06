import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { newBlogValidation } from "./validation.js"
import { getBlogs, writeBlogs } from "../../lib/fs-tools.js"

const blogsRouter = express.Router()
blogsRouter.post("/", newBlogValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() }
      const blogsArray = await getBlogs()
      blogsArray.push(newBlog)
      await writeBlogs(blogsArray)
      res.status(201).send({ id: newBlog.id })
    } else {
      next(createHttpError(400, "Some errors occured in request body!", { errorsList }))
    }
  } catch (error) {
    next(error)
  }
})


blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs()
    if (req.query && req.query.category) {
      const filteredBlogs = blogsArray.filter(blog => blog.category === req.query.category)
      res.send(filteredBlogs)
    } else {

      res.send(blogsArray)
    }
  } catch (error) {
    next(error)
  }
})


blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const blogsArray = await getBlogs()
    const foundBlog = blogsArray.find(blog => blog.id === blogId)
    if (foundBlog) {
      res.send(foundBlog)
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})


blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const blogsArray = await getBlogs()
    const index = blogsArray.findIndex(blog => blog.id === blogId)
    const oldBlog = blogsArray[index]
    const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() }
    blogsArray[index] = updatedBlog
    await writeBlogs(blogsArray)
    res.send(updatedBlog)
  } catch (error) {
    next(error)
  }
})


blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const blogsArray = await getBlogs()
    const remaningBlogs = blogsArray.filter(blog => blog.id !== blogId)
    await writeBlogs(remaningBlogs)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default blogsRouter