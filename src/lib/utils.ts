
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserApplication } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCollectionName(serviceCategory: UserApplication['serviceCategory']): string | null {
  switch (serviceCategory) {
    case 'loan': return 'loanApplications';
    case 'caService': return 'caServiceApplications';
    case 'governmentScheme': return 'governmentSchemeApplications';
    default: return null;
  }
}
