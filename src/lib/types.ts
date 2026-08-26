import z from "zod";

import { area_ids, machine_ids, resource_ids } from "./recipes";

export const RequirementsSchema = z.array(
  z.tuple([
    z.literal(resource_ids),
    z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }),
  ]),
);
export type Requirements = z.infer<typeof RequirementsSchema>;
export const SolverRequestSchema = z.object({
  area: z.literal(area_ids),
  additionalRequirements: z.object({
    balance: RequirementsSchema.optional(),
    output: RequirementsSchema.optional(),
  }),
});
export type SolverRequest = z.infer<typeof SolverRequestSchema>;

export const SolverResponseSchema = z.union([
  z.object({
    status: z.literal("Optimal"),
    problem: z.string(),
    objective: z.number(),
    vars: z.object({
      _c: z.record(z.number(), z.number()),
      _fc: z.record(z.number(), z.number()),
      _i: z.record(z.number(), z.number()),
      _in: z.record(z.number(), z.number()),
      _out: z.record(z.number(), z.number()),
      _p: z.record(z.number(), z.number()),
      _r: z.record(z.number(), z.number()),
    }),
    items: z.array(
      z.object({
        index: z.number(),
        id: z.literal(resource_ids),
        name: z.string(),
        input: z.number(),
        output: z.number(),
        cost: z.number(),
        profit: z.number(),
        balance: z.number(),
      }),
    ),
    recipes: z.array(
      z.object({
        index: z.number(),
        count: z.number(),
        ratio: z.number(),
        input: z.array(
          z.object({
            id: z.literal(resource_ids),
            name: z.string(),
            volume: z.number(),
          }),
        ),
        output: z.array(
          z.object({
            id: z.literal(resource_ids),
            name: z.string(),
            volume: z.number(),
          }),
        ),
        cost: z.array(
          z.object({
            id: z.literal(resource_ids),
            name: z.string(),
            volume: z.number(),
          }),
        ),
        machine: z.object({
          id: z.literal(machine_ids),
          name: z.string(),
        }),
      }),
    ),
  }),
  z.object({
    status: z.literal("Unoptimized"),
    message: z.string(),
    problem: z.string(),
  }),
  z.object({
    status: z.literal("Error"),
    message: z.string(),
  }),
  z.object({ status: z.literal("Initialized") }),
]);
export type SolverResponse = z.infer<typeof SolverResponseSchema>;
