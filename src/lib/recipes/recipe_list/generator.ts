import type { Recipe } from "../types";

export const recipes: Recipe[] = [
  {
    input: { "Originium Ore": 1 },
    output: { Power: 50 * 8 },
    duration: 8,
    machine: "Thermal Bank",
  },
  {
    input: { "LC Valley Battery": 1 },
    output: { Power: 220 * 40 },
    duration: 40,
    machine: "Thermal Bank",
  },
  {
    input: { "SC Valley Battery": 1 },
    output: { Power: 420 * 40 },
    duration: 40,
    machine: "Thermal Bank",
  },
  {
    input: { "HC Valley Battery": 1 },
    output: { Power: 1100 * 40 },
    duration: 40,
    machine: "Thermal Bank",
  },
  {
    input: { "LC Wuling Battery": 1 },
    output: { Power: 1600 * 40 },
    duration: 40,
    machine: "Thermal Bank",
  },
  {
    input: { "SC Wuling Battery": 1 },
    output: { Power: 3200 * 40 },
    duration: 40,
    machine: "Thermal Bank",
  },
  {
    input: {},
    output: { Power: 200 },
    duration: 1,
    machine: "Protocol Automation-Core",
  },
];
