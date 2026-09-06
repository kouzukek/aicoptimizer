import { area_ids, type AreaId } from "./areas";
import { machine_ids, machine_list } from "./machines";
import type { MineTemplates, MiningPoints } from "./mines";
import { resource_ids } from "./resources";
import type { NormalizedRecipes, Quantities, Recipe } from "./types";

type NormalizedRecipe = Omit<NormalizedRecipes["recipes"][number], "groups">;
export const normalize_recipe = (r: Recipe): NormalizedRecipe => {
  const ratio = 60 / r.duration;
  const input: Quantities = {};
  const output: Quantities = {};
  const fixed_costs: Quantities = {};

  const machine = machine_list[r.machine];
  fixed_costs["Power"] = machine.power_use;
  for (const id of resource_ids) {
    if (r.input[id]) input[id] = r.input[id] * ratio;
    if (r.output[id])
      output[id] = (r.output[id] * ratio) / (id === "Power" ? 60 : 1);

    const aux = machine.aux?.[id];
    if (aux)
      fixed_costs[id] =
        (fixed_costs[id] ?? 0) + aux.count * (60 / aux.duration);
  }

  switch (r.environment) {
    case "Acrid":
      fixed_costs["Acridgen"] = (fixed_costs["Acridgen"] ?? 0) + 6;
      break;
    case "Stable":
      fixed_costs["Inergen"] = (fixed_costs["Inergen"] ?? 0) + 6;
      break;
  }

  return {
    input,
    output,
    fixed_costs,
    duration: 60,
    machine: r.machine,
    environment: r.environment,
    origin: r,
  };
};

export const normalize_recipes = (array: Recipe[]): NormalizedRecipes => {
  const groups_def: NormalizedRecipes["groups"] = [];
  const recipes = array.map((r, i) => {
    const groups: string[] = [`:machine:${r.machine}`, `:recipe:${i}`];
    if (r.limit) groups_def.push({ name: `:recipe:${i}`, limit: r.limit });
    return { ...normalize_recipe(r), groups };
  });

  for (const id of machine_ids) {
    const machine = machine_list[id];
    if ("limit" in machine) {
      const { limit } = machine;
      if (limit) groups_def.push({ name: `:machine:${id}`, limit });
    }
  }

  return { recipes, groups: groups_def };
};

export const normalize_mining_points = (
  mine_templates: MineTemplates,
  mining_points: MiningPoints,
): NormalizedRecipes => {
  const recipes: NormalizedRecipes["recipes"] = [];
  const groups: Map<string, NormalizedRecipes["groups"][number]> = new Map();

  const area_limit = (area: AreaId, count: number) =>
    Object.fromEntries(
      area_ids.map((a) => [a, a === area ? count : 0]),
    ) as NormalizedRecipes["groups"][number]["limit"];

  for (const area of area_ids) {
    for (const { resourceId, slots } of mining_points[area]) {
      const templates = mine_templates[area][resourceId];
      if (!templates) continue;

      for (const [tier, count] of Object.entries(slots)) {
        if (!count) continue;

        const factories = templates[tier];
        if (!factories) continue;

        const name = `:mine:${area}:${resourceId}:${tier}`;

        const registered = groups.get(name);
        if (registered) {
          const prev = registered.limit[area];
          registered.limit[area] = prev === "inf" ? "inf" : prev + count;
          continue;
        }
        groups.set(name, { name, limit: area_limit(area, count) });

        for (const factory of factories) {
          const recipe = factory(resourceId);
          recipes.push({
            ...normalize_recipe(recipe),
            groups: [`:machine:${recipe.machine}`, name],
          });
        }
      }
    }
  }

  return { recipes, groups: [...groups.values()] };
};

export const concat_normalized_recipes = (...args: NormalizedRecipes[]) =>
  args.reduce(
    (acc, cur) => ({
      recipes: [...acc.recipes, ...cur.recipes],
      groups: [...acc.groups, ...cur.groups],
    }),
    { recipes: [], groups: [] },
  );
