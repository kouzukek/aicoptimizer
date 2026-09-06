import { mining_points, mine_templates } from "./mines";
import { recipe_list } from "./recipe_list";

import {
  concat_normalized_recipes,
  normalize_mining_points,
  normalize_recipes,
} from "./normalizers";

export const { recipes, groups: limit_groups } = concat_normalized_recipes(
  normalize_recipes(recipe_list),
  normalize_mining_points(mine_templates, mining_points),
);

export type { AreaId } from "./areas";
export type { MachineId } from "./machines";
export type { ResourceId, Group as ResourceGroup } from "./resources";
export type { Recipe, Quantities } from "./types";

export { area_ids, area_list } from "./areas";
export { machine_ids, machine_list } from "./machines";
export { price_list } from "./prices";
export { resource_ids, resource_list, resource_group } from "./resources";
