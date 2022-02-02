import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { newAuthorValidations } from "./validation.js"
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js"

const authorsRouter = express.Router()


authorsRouter.post("/", newAuthorValidations, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {

      const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }


      const authorsArray = await getAuthors()

      authorsArray.push(newAuthor)


      await writeAuthors(authorsArray)

      res.status(201).send({ id: newAuthor.id })
    } else {
      next(createHttpError(400, "Some errors occured in request body!", { errorsList }))
    }
  } catch (error) {
    next(error)
  }
})


authorsRouter.get("/", async (req, res, next) => {
  try {

    const authorsArray = await getAuthors()

    if (req.query && req.query.category) {
      const filteredAuthors = authorsArray.filter(author => author.category === req.query.category)
      res.send(filteredAuthors)
    } else {

      res.send(authorsArray)
    }
  } catch (error) {
    next(error)
  }
})


authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const authorId = req.params.authorId

    const authorsArray = await getAuthors()

    const foundAuthor = authorsArray.find(author => author.id === authorId)
    if (foundAuthor) {
      res.send(foundAuthor)
    } else {
      next(createHttpError(404, `author with id ${req.params.authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})


authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const authorId = req.params.authorId

    const authorsArray = await getAuthors()

    const index = authorsArray.findIndex(author => author.id === authorId)

    const oldAuthor = authorsArray[index]

    const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() }

    authorsArray[index] = updatedAuthor

    await writeAuthors(authorsArray)

    res.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})


authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const authorId = req.params.authorId

    const authorsArray = await getAuthors()

    const remaningAuthors = authorsArray.filter(author => author.id !== authorId)

    await writeAuthors(remaningAuthors)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default authorsRouter;