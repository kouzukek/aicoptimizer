export const format = (
  n: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits?: number,
) =>
  n.toLocaleString(undefined, {
    maximumFractionDigits: maximumFractionDigits ?? minimumFractionDigits,
    minimumFractionDigits,
  });

export function* range(end: number) {
  for (let i = 0; i < end; i++) yield i;
}
