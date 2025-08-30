import { BAD_WORDS } from './bad-words';

/**
 * Checks if the text contains any bad words.
 * @param text - The text to check
 * @returns true if any bad word is found, false otherwise
 */
export function containsBadWords(text: string): boolean {
  if (!text) return false;

  const normalizedText = text.toLowerCase();

  return BAD_WORDS.some((word) => normalizedText.includes(word.toLowerCase()));
}

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

/**
 * Calculates the age in years based on the provided date of birth.
 * @param {Date} dateOfBirth - The person's date of birth.
 * @returns {number} The calculated age in whole years.
 */
export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  const dayDiff = today.getDate() - dateOfBirth.getDate();

  // Adjust if birthday has not occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

/**
 * Formats a numeric amount into a human-readable string with suffixes.
 * This function abbreviates large numbers using:
 * - `K` for thousands
 * - `M` for millions
 * - `B` for billions
 * @param {number} amount - The numeric amount to format.
 * @returns {string} The formatted amount with appropriate suffix.
 */
export function formatAmount(amount: number): string {
  if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1) + 'B';
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + 'M';
  if (amount >= 1_000) return (amount / 1_000).toFixed(1) + 'K';
  return amount.toFixed(2);
}
