import { NextFunction, Request, Response } from "express";
import { getReeceClient, resolveRegion } from "../integrations/reece";

const parsePositiveInteger = (value: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined;
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : undefined;
};

const extractCustomerContext = (req: Request): { customerToken?: string; customerNumber?: string } => {
  const customerToken =
    (req.query.customerToken as string | undefined) ||
    (req.headers["customer-token"] as string | undefined) ||
    (req.headers["x-reece-customer-token"] as string | undefined);
  const customerNumber =
    (req.query.customerNumber as string | undefined) ||
    (req.headers["customer-number"] as string | undefined) ||
    (req.headers["x-reece-customer-number"] as string | undefined);
  return { customerToken, customerNumber };
};

export const searchReeceProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const region = resolveRegion(req.query.region as string | undefined);
    const searchPhrase = req.query.searchPhrase as string | undefined;
    if (!searchPhrase) {
      res.status(400).json({ message: "searchPhrase query parameter is required" });
      return;
    }
    if (searchPhrase.length < 3 || searchPhrase.length > 30) {
      res.status(400).json({ message: "searchPhrase must be between 3 and 30 characters" });
      return;
    }

    const pageNumberParam = req.query.pageNumber;
    const pageSizeParam = req.query.pageSize;
    const pageNumber = parsePositiveInteger(pageNumberParam);
    const pageSize = parsePositiveInteger(pageSizeParam);

    if (pageNumberParam !== undefined && pageNumber === undefined) {
      res.status(400).json({ message: "pageNumber must be a positive integer" });
      return;
    }
    if (pageSizeParam !== undefined && pageSize === undefined) {
      res.status(400).json({ message: "pageSize must be a positive integer" });
      return;
    }

    const client = getReeceClient();
    const data = await client.searchProducts({
      region,
      searchPhrase,
      pageNumber,
      pageSize,
      ...extractCustomerContext(req),
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getReeceBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const region = resolveRegion(req.query.region as string | undefined);
    const client = getReeceClient();
    const data = await client.getBranches({
      region,
      ...extractCustomerContext(req),
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};
