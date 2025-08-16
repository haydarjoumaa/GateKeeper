import type { ErrorRequestHandler } from "express";

type MongooseLikeError = Error & {
  statusCode?: number;
  code?: number; // e.g. 11000 duplicate key
  keyValue?: Record<string, unknown>;
  path?: string; // CastError
  errors?: Record<string, { message: string }>; // ValidationError
  name?: string;
};

const errorMiddleware: ErrorRequestHandler = (rawErr, req, res, next) => {
  if (res.headersSent) return next(rawErr); // let Express finish if headers were already sent

  const err = rawErr as MongooseLikeError;

  let status = err.statusCode ?? 500;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    status = 400; // invalid input
    message = `Invalid parameter: ${err.path ?? "id"}`;
  }

  // Mongo duplicate key
  else if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    status = 409; // conflict
    message = `Duplicate value for ${field}`;
  }

  // Mongoose validation error
  else if (err.name === "ValidationError" && err.errors) {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Optional: only expose stack in non-production
  const payload: Record<string, unknown> = { success: false, error: message };
  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  return res.status(status).json(payload);
};

export default errorMiddleware;
