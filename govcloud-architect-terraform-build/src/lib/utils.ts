// Experiment: Utility functions are under development and may change.
// Authored by Kartik Shankar
// Authored date: March 28, 2025

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
