import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import blogsRouter from "./services/blogs/blogsRoutes.js";
import errorHandler from "./errorHandler.js";
import authorsRouter from "./services/authors/authorsRoute.js";
import path from "path";

const publicPath = path.join(process.cwd(), "public");

const server = express();

server.use(express.static(publicPath));
server.use(express.json());
server.use(helmet());
server.use(morgan("tiny"));
server.use(cors());

server.use("/blogs", blogsRouter);
server.use("/authors", authorsRouter);
server.use(errorHandler);

const PORT = 3002;

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

server.on("error", (error) => {
  console.log("Server is stopped due to error : " + error);
});