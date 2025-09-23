import express from "express";
import { PORT } from "./config/env";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import errorMiddleware from "./middlewares/error.middleware";
import corsMiddleware from "./middlewares/cors.middleware";
import authRouter from "./routes/auth.route";
import categoryRouter from "./routes/category.route";
import sectionRouter from "./routes/section.route";
import serviceRouter from "./routes/service.route";
import supplierRouter from "./routes/supplier.route";
import jobRouter from "./routes/job.route";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(corsMiddleware);

// Routes
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/sections", sectionRouter);
app.use("/services", serviceRouter);
app.use("/suppliers", supplierRouter);
app.use("/jobs", jobRouter);

// CORS
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // if you need cookies/auth
  })
);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log("running on http://localhost:" + PORT);
  await connectDB();
});
