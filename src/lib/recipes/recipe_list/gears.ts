import type { Recipe } from "../types";

export const recipes: Recipe[] = [
  {
    input: { "Origocrust": 5, "Amethyst Fiber": 5 },
    output: { "Amethyst Component": 1 },
    duration: 10,
    machine: "Gearing Unit",
  },
  {
    input: { Origocrust: 10, Ferrium: 10 },
    output: { "Ferrium Component": 1 },
    duration: 10,
    machine: "Gearing Unit",
  },
  {
    input: { "Packed Origocrust": 10, "Cryston Fiber": 10 },
    output: { "Cryston Component": 1 },
    duration: 10,
    machine: "Gearing Unit",
  },
  {
    input: { "Hetonite Part": 2, "Heavy Xiranite": 2 },
    output: { "Hetonite Component": 1 },
    duration: 10,
    machine: "Gearing Unit",
  },
  {
    input: { "Packed Origocrust": 10, "Xiranite": 10 },
    output: { "Xiranite Component": 1 },
    duration: 10,
    machine: "Gearing Unit",
  },
  {
    input: { "Cuprium Part": 10, "Xiranite": 10 },
    output: { "Cuprium Component": 1 },
    duration: 10,
    machine: "Gearing Unit",
  },
  {
    input: { "Heavy Xiranite": 2, "Pyrrolite Part": 1 },
    output: { "Pyrrolite Component": 1 },
    duration: 10,
    machine: "Gearing Unit",
  },
];
