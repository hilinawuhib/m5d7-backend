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
const whiteListedOrigins = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

console.log("Permitted origins:")
console.table(whiteListedOrigins)

server.use(
  cors({
    origin: function (origin, next) {
      console.log("ORIGIN: ", origin)
      // CORS is a global middleware --> for each and every request we are going to be able to read the origin value
      if (!origin || whiteListedOrigins.indexOf(origin) !== -1) {
        // indexOf returns -1 if element is NOT in the array
        console.log("YAY!")
        next(null, true)
      } else {
        // if the origin is NOT in the whitelist I should trigger an error
        next(new Error("CORS ERROR!"))
      }
    },
  })
)

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