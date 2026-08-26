export const format = (n: number, fraction_digits: number = 0) =>
  n.toLocaleString(undefined, {
    maximumFractionDigits: fraction_digits,
    minimumFractionDigits: fraction_digits,
  });

export function* range(end: number) {
  for (let i = 0; i < end; i++) yield i;
}
