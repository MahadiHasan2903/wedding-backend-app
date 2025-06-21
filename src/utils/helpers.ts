/**
 * Sanitizes an unknown error by returning a readable string message.
 *
 * @param error - The unknown error object to sanitize.
 * @returns A string representing the error message.
 */
export const sanitizeError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
};

/**
 * Type guard that checks whether the given value is an array of strings.
 *
 * @param value - The value to check.
 * @returns True if the value is an array where every item is a string, otherwise false.
 */
export const isStringArray = (value: unknown): value is string[] => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
};
