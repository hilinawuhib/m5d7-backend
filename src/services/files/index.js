import express from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { pipeline } from "stream"
import { createGzip } from "zlib"

import { saveAuthorsAvatars, writeAuthors, getBlogsReadableStream } from "../../lib/fs-tools.js"
import { getAuthors } from "../../lib/fs-tools.js"
import { getPDFReadableStream } from "../../lib/pdf-tools.js"

const filesRouter = express.Router()

console.log("CLOUDINARY URL: ", process.env.CLOUDINARY_URL)
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // search automatically for process.env.CLOUDINARY_URL
    params: {
      folder: "oct21",
    },
  }),
}).single("avatar")
filesRouter.post("/uploadSingle", multer().single("avatar"), async (req, res, next) => {
  // "avatar" does need to match exactly to the name used in FormData field in the frontend, otherwise Multer is not going to be able to find the file in the req.body
  try {
    console.log("FILE: ", req.file)
    await saveAuthorsAvatars(req.file.originalname, req.file.buffer)
    res.send("Ok")
  } catch (error) {
    next(error)
  }
})
filesRouter.post("/uploadMultiple", multer().array("avatar"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.files)
    const arrayOfPromises = req.files.map(file => saveUsersAvatars(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send("Ok")
  } catch (error) {
    next(error)
  }
})
filesRouter.post("/:AuthorId/cloudinaryUpload", cloudinaryUploader, async (req, res, next) => {
  try {
    console.log(req.file)
    const authors = await getAuthors()
    const index = authors.findIndex(author => author.id === req.params.authorId)
    const oldAuthor = authors[index]
    const updatedAuthor = { ...oldAuthor, avatar: req.file.path }
    authors[index] = updatedAuthor
    await writeAuthors(authors)
    res.send("Uploaded on Cloudinary!")
  } catch (error) {
    next(error)
  }
})
filesRouter.get("/downloadJSON", (req, res, next) => {
  try {
    // SOURCE (file on disk, http requests,...) --> DESTINATION (file on disk, terminal, http responses,...)
    // In this example we are going to have: SOURCE (file on disk: books.json) --> DESTINATION (http response)
    res.setHeader("Content-Disposition", "attachment; filename=blogs.json.gz") // This header tells the browser to open the "Save file on Disk" dialog
    const source = getBlogsReadableStream()
    const transform = createGzip()
    const destination = res
    pipeline(source, transform, destination, err => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/downloadPDF", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=test.pdf")

    const source = getPDFReadableStream("EXAMPLE TEXT")
    const destination = res
    pipeline(source, destination, err => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
})

export default filesRouter