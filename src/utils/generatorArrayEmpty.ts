export const generatorArrayEmpty = (length:number) => {
  return Array.from({ length }, (_, index) => index + 1);
} 