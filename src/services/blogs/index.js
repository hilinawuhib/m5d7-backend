// ***************************** USERS ENDPOINTS ******************************************

/* ****************************** USERS CRUD **********************************************
1. CREATE --> POST http://localhost:3001/blogs (+ body)
2. READ --> GET http://localhost:3001/blogs (+ optional query parameters)
3. READ (single user) --> GET http://localhost:3001/blogs/:blogId
4. UPDATE (single user) --> PUT http://localhost:3001/blogs/:blogId (+ body)
5. DELETE (single user) --> DELETE http://localhost:3001/blogs/:blogId
*/

import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { newBlogValidation } from "./validation.js"
import { getBlogs, writeBlogs, getUsers } from "../../lib/fs-tools.js"

const blogsRouter = express.Router()

// 1.
blogsRouter.post("/", newBlogValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      // 1. Get new blog info from req.body & Add additional info
      const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() }

      // 2. Read blogs.json file --> buffer --> array
      const blogsArray = await getBlogs()

      // 3. Add new blog to array
      blogsArray.push(newBlog)

      // 4. Write array to file
      await writeBlogs(blogsArray)

      // 5. Send back a proper response
      res.status(201).send({ id: newBlog.id })
    } else {
      next(createHttpError(400, "Some errors occured in request body!", { errorsList }))
    }
  } catch (error) {
    next(error)
  }
})

// 2.
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

// 3.
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

// 4.
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

// 5.
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

// blogsRouter.get("/example", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error)
//   }
// })

export default blogsRouter