// 📦 Gerekli kütüphane importları
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 🔐 Roller (enum benzeri yapı)
export const Roles = {
  ADMIN: "admin",
  USER: "user",
};

/**
 * 🎨 Tailwind sınıflarını birleştirir (clsx + tailwind-merge)
 * @param  {...any} inputs - CSS class dizisi
 * @returns {string} - Birleştirilmiş class stringi
 */
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

