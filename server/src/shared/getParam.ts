import { Request } from "express";

/**
 * Express 5 types route params as `string | string[]` because of wildcard support.
 * Every route in this API uses single-value params, so this narrows it in one place
 * instead of casting at each call site.
 */
const getParam = (req: Request, key: string): string => {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
};

export default getParam;
