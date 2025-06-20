// function to sanitize error message
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
