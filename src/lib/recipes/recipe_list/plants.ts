import type { Recipe } from "../types";

export const recipes: Recipe[] = [
  {
    input: { "Buckflower Seed": 1 },
    output: { Buckflower: 1 },
    duration: 2,
    machine: "Planting Unit",
  },
  {
    input: { "Citrome Seed": 1 },
    output: { Citrome: 1 },
    duration: 2,
    machine: "Planting Unit",
  },
  {
    input: { "Aketine Seed": 1 },
    output: { Aketine: 1 },
    duration: 2,
    machine: "Planting Unit",
  },
  {
    input: { "Sandleaf Seed": 1 },
    output: { Sandleaf: 1 },
    duration: 2,
    machine: "Planting Unit",
  },
  {
    input: { "Yazhen Seed": 1, "Clean Water": 1 },
    output: { Yazhen: 2 },
    duration: 2,
    machine: "Planting Unit",
  },
  {
    input: { "Jincao Seed": 1, "Clean Water": 1 },
    output: { Jincao: 2 },
    duration: 2,
    machine: "Planting Unit",
  },
  {
    input: { Buckflower: 1 },
    output: { "Buckflower Seed": 2 },
    duration: 2,
    machine: "Seed-Picking Unit",
  },
  {
    input: { Citrome: 1 },
    output: { "Citrome Seed": 2 },
    duration: 2,
    machine: "Seed-Picking Unit",
  },
  {
    input: { Sandleaf: 1 },
    output: { "Sandleaf Seed": 2 },
    duration: 2,
    machine: "Seed-Picking Unit",
  },
  {
    input: { Aketine: 1 },
    output: { "Aketine Seed": 2 },
    duration: 2,
    machine: "Seed-Picking Unit",
  },
  {
    input: { Yazhen: 1 },
    output: { "Yazhen Seed": 1 },
    duration: 2,
    machine: "Seed-Picking Unit",
  },
  {
    input: { Jincao: 1 },
    output: { "Jincao Seed": 1 },
    duration: 2,
    machine: "Seed-Picking Unit",
  },
];
