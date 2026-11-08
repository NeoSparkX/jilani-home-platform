import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizePhoneNumber(input: string): string {
  if (!input) return '';
  // Remove all non-numeric characters (spaces, +, -, (), etc.)
  let clean = input.replace(/\D/g, '');

  // If it starts with 0088, strip 0088
  if (clean.startsWith('0088')) {
    clean = clean.substring(4);
  }

  // If it starts with 880, strip the 88
  if (clean.startsWith('880')) {
    clean = clean.substring(2);
  } else if (clean.startsWith('88') && clean.length === 13) {
    clean = clean.substring(2);
  }

  // If user entered +880 01... resulting in double zero
  if (clean.startsWith('001') && clean.length === 12) {
    clean = clean.substring(1);
  }

  // If it's a 10-digit number starting with 1, add the leading 0 (e.g. 1315201696 -> 01315201696)
  if (clean.length === 10 && clean.startsWith('1')) {
    clean = '0' + clean;
  }

  return clean; // Returns standard format: 01315201696
}