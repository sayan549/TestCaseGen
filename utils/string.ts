// utils/string.ts

export const capitalize = (str: string): string => {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

export const reverse = (str: string): string => {
  return str.split("").reverse().join("");
};
