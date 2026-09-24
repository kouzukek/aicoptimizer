import type { Recipe } from "../types";

export const recipes: Recipe[] = [
  {
    input: {},
    output: { "Clean Water": 1 },
    duration: 1,
    limit: { Wuling: "inf", Valley: 0 },
    machine: "Fluid Pump",
  },
  {
    input: {},
    output: { "Precipitation Acid": 1 },
    duration: 2,
    limit: { Wuling: "inf", Valley: 0 },
    machine: "Acid Resistant Pump Mk II",
  },
];
