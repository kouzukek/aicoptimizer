import type { Recipe } from "../types";

export const recipes: Recipe[] = [
  {
    input: { "Cuprium Gas": 2, "Xiragen": 1 },
    output: { "Proto Xiran-Cuprium Gas": 1 },
    duration: 2,
    machine: "Gas Reactor Globe",
    environment: "Stable",
  },
  {
    input: { "Inergen": 5, "Proto Heavy Xiranite": 1 },
    output: { "Proto Chubby Lung Heavy Shell": 1 },
    duration: 10,
    machine: "Moulding Unit",
  },
  {
    input: { "Proto Xiran-Cuprium Gas": 1 },
    output: { "Proto Xiran-Cuprium": 1 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { "Proto Xiran-Cuprium": 1 },
    output: { "Proto Xiran-Cuprium Gas": 1 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { "Proto Xiran-Cuprium": 5 },
    output: { "Proto Xiran-Cuprium Part": 1 },
    duration: 10,
    machine: "Fitting Unit",
  },
  {
    input: { "Proto Xiranite": 1 },
    output: { "Proto Chubby Lung Shell": 1 },
    duration: 2,
    machine: "Moulding Unit",
  },
  {
    input: { "Xiranite": 1, "Cuprium Part": 4 },
    output: { "Proto Cuprium Frame": 1 },
    duration: 2,
    machine: "Packaging Unit",
  },
  {
    input: { "Heavy Xiranite": 1, "Proto Xiran-Cuprium Part": 1 },
    output: { "Proto Xiran-Cuprium Frame": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Proto Chubby Lung Shell": 5, "Proto Cuprium Frame": 5 },
    output: { "Xiranite Chubby Lung": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: {
      "Proto Chubby Lung Heavy Shell": 1,
      "Proto Xiran-Cuprium Frame": 1,
    },
    output: { "Heavy Xiranite Chubby Lung": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { Xiranite: 1 },
    output: { "Proto Xiranite": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Heavy Xiranite": 1 },
    output: { "Proto Heavy Xiranite": 1 },
    duration: 10,
    machine: "Refining Unit",
  },
];
