import type { AreaId } from "./areas";
import type { MachineId } from "./machines";
import type { ResourceId } from "./resources";

export type Environment = "Stable" | "Acrid";

export type Quantities = { [key in ResourceId]?: number };
export type Recipe = {
  input: Quantities;
  output: Quantities;
  duration: number;
  environment?: Environment;
  machine: MachineId;
  limit?: { [key in AreaId]: number | "inf" };
};

export type NormalizedRecipes = {
  recipes: (Omit<Recipe, "limit"> & {
    groups: string[];
    fixed_costs: Quantities;
    origin: Recipe;
  })[];
  groups: { name: string; limit: { [key in AreaId]: number | "inf" } }[];
};
