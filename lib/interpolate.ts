export interface DataPoint {
  year: number;
  value: number;
}

export const linearInterpolate = (
  data: DataPoint[],
  year: number
): number => {
  if (data.length === 0) return 0;
  if (data.length === 1) return data[0].value;
  if (year <= data[0].year) return data[0].value;
  if (year >= data[data.length - 1].year) return data[data.length - 1].value;

  let lo = 0;
  let hi = data.length - 1;

  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (data[mid].year <= year) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const a = data[lo];
  const b = data[hi];
  const t = (year - a.year) / (b.year - a.year);
  return a.value + t * (b.value - a.value);
};
