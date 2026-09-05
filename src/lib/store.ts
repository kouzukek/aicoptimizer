import { atom } from "jotai";

import type { AreaId, ResourceId } from "./recipes";
import {
  type Requirements,
  type SolverRequest,
  type SolverResponse,
} from "./types";

export type SystemStatus = {
  run_ids: string[];
};
export const statusAtom = atom<SystemStatus>({ run_ids: [] });

export const planAtom = atom<SolverRequest>({
  area: "Wuling",
  additionalRequirements: {},
});
export const areaAtom = atom(
  (get) => get(planAtom).area,
  (get, set, area: AreaId) => set(planAtom, { ...get(planAtom), area }),
);

type Requirement = Requirements[number];
type Bounds = Requirement[1];
type Target = keyof SolverRequest["additionalRequirements"];
export const additionalRequirementsAtom = atom(
  (get) => get(planAtom).additionalRequirements,
  (get, set, target: Target, id: ResourceId, patch: Bounds | null) => {
    const prev = get(planAtom);
    const ars = prev.additionalRequirements;
    const reqs = ars[target] ?? [];
    const found = reqs.some(([rid]) => rid === id);

    set(planAtom, {
      ...prev,
      additionalRequirements: {
        ...ars,
        [target]:
          patch === null
            ? reqs.filter(([rid]) => rid !== id)
            : found
              ? reqs.map((req): Requirement =>
                  req[0] === id ? [id, { ...req[1], ...patch }] : req,
                )
              : [...reqs, [id, patch]],
      },
    });
  },
);
export const resultAtom = atom<SolverResponse & { duration?: number }>({
  status: "Initialized",
});
export const build_error_result = (e: unknown): SolverResponse => {
  return {
    status: "Error",
    message: e instanceof Error ? e.message : JSON.stringify(e),
  };
};
