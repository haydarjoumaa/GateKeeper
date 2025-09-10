import express from "express";
import { PORT } from "./config/env";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import errorMiddleware from "./middlewares/error.middleware";
import authRouter from "./routes/auth.route";
import categoryRouter from "./routes/category.route";
import sectionRouter from "./routes/section.route";
import serviceRouter from "./routes/service.route";
import supplierRouter from "./routes/supplier.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/sections", sectionRouter);
app.use("/services", serviceRouter);
app.use("/suppliers", supplierRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log("running on http://localhost:" + PORT);
  await connectDB();
});
