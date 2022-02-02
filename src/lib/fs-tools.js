import fs from "fs-extra" // 3rd party module
import { fileURLToPath } from "url"
import { join, dirname } from "path"

const { readJSON, writeJSON, writeFile , createdReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const usersPublicFolderPath = join(process.cwd(), "./public/img/users")

const blogsJSONPath = join(dataFolderPath, "blogs.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")

export const getBlogs = () => readJSON(blogsJSONPath)
export const writeBlogs = content => writeJSON(blogsJSONPath, content)
export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = content => writeJSON(authorsJSONPath, content)

export const saveUsersAvatars = (filename, contentAsABuffer) => writeFile(join(usersPublicFolderPath, filename), contentAsABuffer)
