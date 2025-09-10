import type { Request, Response, NextFunction } from "express";

// Lightweight CORS middleware without external dependency
// Adjust `allowedOrigins` as needed for other frontends/environments
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin as string | undefined;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  // Ensure caches/proxies vary by Origin
  res.header("Vary", "Origin");

  // If you use cookies/credentials across origins, keep this true
  res.header("Access-Control-Allow-Credentials", "true");

  // Allowed headers/methods for preflight and actual requests
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

  // Short-circuit preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
}

export default corsMiddleware;

