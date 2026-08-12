/**
 * Picks only the allowed keys out of a query/body object, dropping empty values.
 * Used by controllers to build filter and pagination objects safely.
 */
const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== undefined && value !== null && value !== "") {
        finalObj[key] = value;
      }
    }
  }

  return finalObj;
};

export default pick;
