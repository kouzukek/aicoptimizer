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
    profits: z.object({
      items: z.array(
        z.object({
          id: z.literal(resource_ids),
          name: z.string(),
          count: z.number(),
          profit: z.number(),
        }),
      ),
      totalProfit: z.number(),
    }),
    balance: z.array(
      z.object({
        zone_id: z.number(),
        zone: z.string(),
        items: z.array(
          z.object({
            id: z.literal(resource_ids),
            name: z.string(),
            output: z.number(),
            input: z.number(),
            balance: z.number(),
          }),
        ),
      }),
    ),
    power: z.object({
      machines: z.array(
        z.object({
          id: z.literal(machine_ids),
          name: z.string(),
          count: z.number(),
          ratio: z.number(),
          output: z.number(),
          input: z.number(),
        }),
      ),
      total: z.object({ output: z.number(), input: z.number() }),
    }),
    operation: z.array(
      z.object({
        zone_id: z.number(),
        zone: z.string(),
        recipes: z.array(
          z.object({
            machine: z.string(),
            input: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                volume: z.number(),
              }),
            ),
            costs: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                volume: z.number(),
              }),
            ),
            output: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                volume: z.number(),
              }),
            ),
            count: z.number(),
            ratio: z.number(),
          }),
        ),
      }),
    ),
    flow: z.object({
      nodes: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          kind: z.string(),
          parent: z.string().optional(),
        }),
      ),
      edges: z.array(
        z.object({
          source: z.string(),
          target: z.string(),
          kind: z.string(),
        }),
      ),
    }),
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
