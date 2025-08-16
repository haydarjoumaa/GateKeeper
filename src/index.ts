import express from "express";
import { PORT } from "./config/env";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log("running on http://localhost:" + PORT);
  await connectDB();
});
