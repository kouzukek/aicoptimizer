import Highs, { type Model } from "highs";

import {
  machine_list,
  recipes,
  limit_groups,
  price_list,
  resource_ids,
  resource_list,
  type MachineId,
} from "./recipes";
import { type SolverRequest, type SolverResponse } from "./types";
import { range, format } from "./utils";

const DEBUG = true;

function key_encoder<Key extends Record<string, number>>(key: Key): string {
  return Object.keys(key)
    .toSorted()
    .map((k) => `${key[k]}`)
    .join("_");
}

const to_lp_format = (lp: ReturnType<Model["getPresolvedLp"]>): string => {
  const {
    numCols,
    numRows,
    sense,
    offset,
    colCost,
    colLower,
    colUpper,
    rowLower,
    rowUpper,
    matrix,
    integrality,
  } = lp;
  const fin = Number.isFinite;
  const cn = (j: number) => `x${j}`;

  const rows: [number, number][][] = Array.from({ length: numRows }, () => []);
  const { starts, indices, values } = matrix;
  if (matrix.format === "csc")
    for (let j = 0; j < numCols; j++)
      for (let p = starts[j]; p < starts[j + 1]; p++)
        rows[indices[p]].push([values[p], j]);
  else
    for (let i = 0; i < numRows; i++)
      for (let p = starts[i]; p < starts[i + 1]; p++)
        rows[i].push([values[p], indices[p]]);

  const expr = (terms: [number, number][]) =>
    terms
      .filter(([c]) => c !== 0)
      .map(([c, j], i) =>
        [
          c < 0 ? "-" : i === 0 ? undefined : "+",
          Math.abs(c) === 1 ? undefined : format(Math.abs(c), 0, 4),
          cn(j),
        ]
          .filter((s) => s !== undefined)
          .join(" "),
      )
      .join(" ");

  const out = [sense === -1 ? "MAXIMIZE" : "MINIMIZE"];
  out.push(
    ` obj: ${expr([...colCost].map((c, j) => [c, j]))}` +
      (offset ? ` ${offset < 0 ? "-" : "+"} ${Math.abs(offset)}` : ""),
  );

  out.push("SUBJECT TO");
  for (let i = 0; i < numRows; i++) {
    const e = expr(rows[i]);
    if (e === "") continue; // 空行は捨てる
    if (rowLower[i] === rowUpper[i]) out.push(` R${i}: ${e} = ${rowUpper[i]}`);
    else {
      // LP format に RANGES は無いので2本に割る
      if (fin(rowUpper[i])) out.push(` R${i}u: ${e} <= ${rowUpper[i]}`);
      if (fin(rowLower[i])) out.push(` R${i}l: ${e} >= ${rowLower[i]}`);
    }
  }

  const bounds: string[] = [];
  for (let j = 0; j < numCols; j++) {
    const [lo, hi] = [colLower[j], colUpper[j]];
    if (lo === 0 && !fin(hi)) continue; // LP format の既定は [0, inf)
    if (lo === hi) bounds.push(` ${cn(j)} = ${format(lo, 0, 4)}`);
    else if (!fin(lo) && !fin(hi)) bounds.push(` ${cn(j)} free`);
    else if (!fin(lo)) bounds.push(` -inf <= ${cn(j)} <= ${format(hi, 0, 4)}`);
    else if (!fin(hi)) bounds.push(` ${cn(j)} >= ${format(lo, 0, 4)}`);
    else bounds.push(` ${format(lo, 0, 4)} <= ${cn(j)} <= ${format(hi, 0, 4)}`);
  }
  if (bounds.length) out.push("BOUNDS", ...bounds);

  const gen = [...(integrality ?? [])]
    .map((t, j) => (t === 1 || t === 4 ? cn(j) : null))
    .filter((s) => s !== null);
  if (gen.length) out.push("GENERAL", ` ${gen.join(" ")}`);

  out.push("END");
  return out.join("\n");
};

type Options = Partial<{
  min: Constant;
  max: Constant;
  type: "binary" | "integer" | "real";
}>;

class Variable {
  public readonly name: string;
  public options: Required<Options>;
  public constructor(name: string, options?: Options) {
    this.name = name;
    this.options = {
      min: options?.min ?? 0,
      max: options?.max ?? "inf",
      type: options?.type ?? "real",
    };
  }
  public setOptions(options: Options) {
    this.options = {
      min: options?.min ?? this.options.min,
      max: options?.max ?? this.options.max,
      type: options?.type ?? this.options.type,
    };
  }
}

class Variables<Key extends Record<string, number>> {
  private _map: Map<string, Variable>;

  public constructor() {
    this._map = new Map();
  }
  public set(key: Key, val: Variable) {
    this._map.set(key_encoder(key), val);
  }
  public get(key: Key) {
    const v = this._map.get(key_encoder(key));
    if (!v) throw new Error("Invalid key.");
    return v;
  }
}

type Result = {
  status: string;
  problem: string;
  objective: number;
  columns: Map<Variable, number>;
};

type Sense = "Minimize" | "Maximize";
type Operator = "=" | ">=" | "<=";
type Term = [number, Variable];
type Constant = number | "-inf" | "inf";
type Constraint = {
  lhs: Term[];
  op: Operator;
  rhs: Constant;
};

export class Solver {
  private sense: Sense;
  private vars: Set<Variable>;
  private objective: Term[];
  private constraints: Constraint[];

  public constructor(sense: Sense = "Maximize") {
    this.sense = sense;
    this.vars = new Set();
    this.objective = [];
    this.constraints = [];
  }

  public createVar(name: string, options?: Options): Variable {
    const _var = new Variable(name, options);
    this.vars.add(_var);
    return _var;
  }

  public createVars<IndexKey extends string>(
    prefix: string,
    index: Record<IndexKey, number>,
    options?: Options,
  ): Variables<Record<IndexKey, number>> {
    const vars = new Variables<Record<IndexKey, number>>();

    const keys = (Object.keys(index) as IndexKey[]).toSorted();
    for (const _key of keys
      .map((k) => [...range(index[k])])
      .reduce(
        (acc, cur) => {
          const arr: number[][] = [];
          acc.forEach((prev) => cur.forEach((v) => arr.push([...prev, v])));
          return arr;
        },
        [[]] as number[][],
      )
      .map((arr) => keys.map((key, i) => [key, arr[i]]))) {
      const key = Object.fromEntries(_key);
      const _var = this.createVar(`${prefix}_${key_encoder(key)}`, options);
      vars.set(key, _var);
    }

    return vars;
  }

  public setObjective(exp: Term[]) {
    this.objective = exp;
  }
  public addConstraint(
    lhs: Constraint["lhs"],
    op: Constraint["op"],
    rhs: Constraint["rhs"],
  ) {
    this.constraints.push({ lhs, op, rhs });
  }
  private build_expression(term: Term[]): string | null {
    if (term.some(([, v]) => !this.vars.has(v)))
      throw new Error("Unknown variable used.");

    const filtered_term = term.filter(([c]) => c !== 0);
    if (filtered_term.length === 0) return null;

    return filtered_term
      .map(([c, v], i) =>
        [
          c < 0 ? "-" : i === 0 ? undefined : "+",
          Math.abs(c) === 1 ? undefined : Math.abs(c),
          v.name,
        ]
          .filter((s) => s !== undefined)
          .join(" "),
      )
      .join(" ");
  }
  private build_constraint(cons: Constraint): string | null {
    const lhs = this.build_expression(cons.lhs);

    if (lhs === null) return null;

    return `${lhs} ${cons.op} ${cons.rhs}`;
  }
  private build_problem(): string {
    return [
      this.sense === "Maximize" ? "MAXIMIZE" : "MINIMIZE",
      this.build_expression(this.objective),
      "SUBJECT TO",
      ...this.constraints.map((cons) => this.build_constraint(cons)),
      "BOUNDS",
      ...[...this.vars]
        .filter((v) => v.options.min !== 0)
        .map((v) =>
          this.build_constraint({
            lhs: [[1, v]],
            op: ">=",
            rhs: v.options.min,
          }),
        ),
      ...[...this.vars]
        .filter((v) => v.options.max !== "inf")
        .map((v) =>
          this.build_constraint({
            lhs: [[1, v]],
            op: "<=",
            rhs: v.options.max,
          }),
        ),
      "GENERAL",
      [...this.vars]
        .filter((v) => v.options.type === "integer")
        .map((v) => v.name)
        .join(" "),
      "BINARY",
      [...this.vars]
        .filter((v) => v.options.type === "binary")
        .map((v) => v.name)
        .join(" "),
      "END",
    ]
      .filter((s) => s !== null)
      .join("\n");
  }
  public async solve(mip_rel_gap = 0): Promise<Result> {
    if (this.objective.length === 0 || this.constraints.length === 0)
      throw new Error("Objective or constraints is empty.");
    const problem = this.build_problem();

    const highs = await Highs({
      locateFile: (file) => {
        if (file.endsWith(".wasm")) return "/highs.wasm";
        return file;
      },
      ...(DEBUG
        ? {
            print: (line) => console.log(`[Highs] ${line}`),
            printErr: (line) => console.error(`[Highs] ${line}`),
          }
        : {}),
    });

    if (DEBUG) {
      const model = highs.createModel({ format: "lp", data: problem });
      model.options.set({ output_flag: true, presolve: "on" });
      model.presolve();
      console.log(model.getLp());
      console.log(problem);
      console.log(to_lp_format(model.getPresolvedLp()));
    }

    const result = highs.solve(problem, {
      time_limit: 60 * 10,
      presolve: "on",
      mip_rel_gap,
      output_flag: DEBUG,
    });

    const columns = new Map<Variable, number>();
    if (result.Status === "Optimal")
      for (const v of this.vars) {
        if (v.name in result.Columns)
          columns.set(v, result.Columns[v.name].Primal);
      }

    return {
      status: result.Status,
      problem,
      objective: result.ObjectiveValue,
      columns,
    };
  }
}

const fluid_ids = resource_ids.filter(
  (id) =>
    "prevent_overflow" in resource_list[id] &&
    resource_list[id].prevent_overflow === true,
);
const recipes_with_fluid = recipes
  .map(({ input, output, fixed_costs }, i) =>
    fluid_ids.some(
      (id) =>
        (input[id] ?? 0) > 0 ||
        (output[id] ?? 0) > 0 ||
        (fixed_costs[id] ?? 0) > 0,
    )
      ? i
      : null,
  )
  .filter((i) => i !== null) as number[];

export async function solve({
  area,
  additionalRequirements,
}: SolverRequest): Promise<SolverResponse> {
  let presolve: Result | null = null;
  if (DEBUG) {
    console.log(JSON.stringify(recipes, null, 4));
  }

  for (let i = 0; i < 2; i++) {
    const solver = new Solver();

    const n_max = resource_ids.length;
    const k_max = recipes.length;
    const z_max = presolve ? 4 : 1;

    const _i = solver.createVars("i", { n: n_max });
    const _s = solver.createVars(
      "_s",
      { n: n_max, z: z_max },
      { min: "-inf", max: "inf" },
    );
    const _splus = solver.createVars("_splus", { n: n_max, z: z_max });
    const _sminus = solver.createVars("_sminus", { n: n_max, z: z_max });
    const _in = solver.createVars("_in", { n: n_max, z: z_max });
    const _out = solver.createVars("_out", { n: n_max, z: z_max });
    const _fc = solver.createVars("_fc", { n: n_max, z: z_max });

    const _c = solver.createVars(
      "c",
      { k: k_max, z: z_max },
      { type: "integer" },
    );
    const _r = solver.createVars("r", { k: k_max, z: z_max });
    const _p = solver.createVars("p", { n: n_max });

    // sum(p{n})
    solver.setObjective(
      [...range(n_max)]
        .map((n): Term[] => [
          [1, _p.get({ n })],
          ...[...range(z_max)].map((z): Term => [
            resource_ids[n] === "Power" ? 0 : -0.05,
            _sminus.get({ n, z }),
          ]),
        ])
        .flat(),
    );

    for (const n of range(n_max)) {
      const id = resource_ids[n];
      const resource = resource_list[id];
      // p{n} = price * i{n}
      solver.addConstraint(
        [
          [1, _p.get({ n })],
          [-1 * (price_list[area][id] ?? 0), _i.get({ n })],
        ],
        "=",
        0,
      );

      // i{n} = sum(s{n,z})
      solver.addConstraint(
        [
          [1, _i.get({ n })],
          ...[...range(z_max)].map((z): Term => [-1, _s.get({ n, z })]),
        ],
        "=",
        0,
      );

      for (const z of range(z_max)) {
        // s{n,z} = in{n,z} - out{n,z} - fc{n,z}
        solver.addConstraint(
          [
            [1, _s.get({ n, z })],
            [-1, _out.get({ n, z })],
            [1, _in.get({ n, z })],
            [1, _fc.get({ n, z })],
          ],
          "=",
          0,
        );
        solver.addConstraint(
          [
            [1, _s.get({ n, z })],
            [-1, _splus.get({ n, z })],
            [1, _sminus.get({ n, z })],
          ],
          "=",
          0,
        );

        // (out/in/fc){n} = N * (r/c){k}
        solver.addConstraint(
          [
            [1, _out.get({ n, z })],
            ...[...range(k_max)].map((k): Term => [
              -1 * (recipes[k].output[id] ?? 0),
              _r.get({ k, z }),
            ]),
          ],
          "=",
          0,
        );
        solver.addConstraint(
          [
            [1, _in.get({ n, z })],
            ...[...range(k_max)].map((k): Term => [
              -1 * (recipes[k].input[id] ?? 0),
              _r.get({ k, z }),
            ]),
          ],
          "=",
          0,
        );
        solver.addConstraint(
          [
            [1, _fc.get({ n, z })],
            ...[...range(k_max)].map((k): Term => [
              -1 * (recipes[k].fixed_costs[id] ?? 0),
              _c.get({ k, z }),
            ]),
          ],
          "=",
          0,
        );
        // Prevent overflow
        if (
          "prevent_overflow" in resource &&
          resource.prevent_overflow === true
        )
          solver.addConstraint([[1, _s.get({ n, z })]], "=", 0);
      }
    }
    for (const k of range(k_max)) {
      for (const z of range(z_max)) {
        // c-1 <= r <= c
        solver.addConstraint(
          [
            [1, _r.get({ k, z })],
            [-1, _c.get({ k, z })],
          ],
          "<=",
          0,
        );
        solver.addConstraint(
          [
            [1, _c.get({ k, z })],
            [-1, _r.get({ k, z })],
          ],
          "<=",
          presolve ? 1 : 4,
        );

        if (presolve) {
          if (!recipes_with_fluid.includes(k)) {
            const pr = [...presolve.columns.keys()].find(
              (key) => key.name === `c_${k}_0`,
            );
            if (pr) {
              const value = presolve.columns.get(pr) ?? 0;
              if (Math.abs(value) < 1e-6) {
                solver.addConstraint([[1, _c.get({ k, z })]], "=", 0);
                solver.addConstraint([[1, _r.get({ k, z })]], "=", 0);
                _c.get({ k, z }).setOptions({ type: "real" });
              }
            }
          }
        }
      }
    }

    for (const z of range(z_max)) {
      // sum(c{k,z}) <= 40
      const excluded_machines: MachineId[] = [
        "Hydro Mining Rig",
        "Electric Mining Rig",
        "Electric Mining Rig Mk II",
        "Gas Extractor",
        "Fluid Pump",
        "Acid Resistant Pump Mk II",
      ];
      solver.addConstraint(
        [...range(k_max)].map((k): Term => [
          excluded_machines.includes(recipes[k].machine) ? 0 : 1,
          _c.get({ k, z }),
        ]),
        "<=",
        presolve === null ? "inf" : z === 0 ? 80 : 40,
      );
    }

    {
      const terms: Term[] = [];
      for (const k of range(k_max)) {
        for (const z of range(z_max)) {
          const raw = recipes[k].origin;
          if (raw.machine === "Thermal Bank") {
            const e = raw.output["Power"] ?? 0;
            terms.push([e, _c.get({ k, z })], [-e, _r.get({ k, z })]);
          }
        }
      }
      solver.addConstraint(terms, "<=", 100000);
    }

    for (const group of limit_groups) {
      const name = group.name;
      const limit = group.limit[area];
      if (limit !== "inf")
        solver.addConstraint(
          [...range(k_max)]
            .map((k) =>
              [...range(z_max)].map((z): Term => [
                recipes[k].groups.includes(name) ? 1 : 0,
                _c.get({ k, z }),
              ]),
            )
            .flat(),
          "<=",
          limit,
        );
    }

    for (const [id, { min, max }] of additionalRequirements["balance"] ?? []) {
      const n = resource_ids.indexOf(id);
      if (min !== undefined || max !== undefined)
        _i.get({ n }).setOptions({ min, max });
    }

    for (const [id, { min, max }] of additionalRequirements["output"] ?? []) {
      const n = resource_ids.indexOf(id);
      if (min !== undefined || max !== undefined) {
        solver.addConstraint(
          [...range(z_max)].map((z) => [1, _out.get({ n, z })]),
          ">=",
          min ?? 0,
        );
        solver.addConstraint(
          [...range(z_max)].map((z) => [1, _out.get({ n, z })]),
          "<=",
          max ?? "inf",
        );
      }
    }

    const result = await solver.solve(presolve ? 0.05 : 0);
    console.log(result);

    if (result.status !== "Optimal")
      return {
        status: "Unoptimized",
        message: result.status,
        problem: result.problem,
      };

    if (!presolve) {
      presolve = result;
      continue;
    }

    return {
      status: "Optimal",
      profits: {
        items: [...range(n_max)]
          .map((n) => ({
            id: resource_ids[n],
            name: resource_list[resource_ids[n]].name,
            count: result.columns.get(_i.get({ n })) ?? 0,
            profit: result.columns.get(_p.get({ n })) ?? 0,
          }))
          .filter(
            ({ id, profit }) =>
              profit > 1e-6 ||
              additionalRequirements.balance?.find(([rid]) => rid === id) ||
              additionalRequirements.output?.find(([rid]) => rid === id),
          )
          .toSorted((a, b) => b.profit - a.profit),
        totalProfit: [...range(n_max)].reduce(
          (acc, n) => acc + (result.columns.get(_p.get({ n })) ?? 0),
          0,
        ),
      },
      balance: [...range(z_max)].map((z) => ({
        zone_id: z,
        zone: `zone-${z}`,
        items: [...range(n_max)]
          .map((n) => {
            const input =
              (result.columns.get(_in.get({ n, z })) ?? 0) +
              (result.columns.get(_fc.get({ n, z })) ?? 0);
            const output = result.columns.get(_out.get({ n, z })) ?? 0;

            return {
              id: resource_ids[n],
              name: resource_list[resource_ids[n]].name,
              output,
              input,
              balance: output - input,
            };
          })
          .filter(
            ({ id, output, input, balance }) =>
              id !== "Power" &&
              (output >= 1e-6 || input >= 1e-6 || balance >= 1e-6),
          )
          .toSorted((a, b) => b.output - a.output),
      })),
      power: (() => {
        let totalInput = 0;
        let totalOutput = 0;
        const stocker = new Map<
          MachineId,
          { c: number; r: number; output: number; input: number }
        >();

        for (const k of range(k_max)) {
          for (const z of range(z_max)) {
            const machine = recipes[k].machine;
            const prev = stocker.get(machine) ?? {
              c: 0,
              r: 0,
              output: 0,
              input: 0,
            };

            const c = result.columns.get(_c.get({ k, z })) ?? 0;
            const r = result.columns.get(_r.get({ k, z })) ?? 0;
            const output = (recipes[k].output["Power"] ?? 0) * r;
            const input =
              (recipes[k].input["Power"] ?? 0) * r +
              (recipes[k].fixed_costs["Power"] ?? 0) * c;

            totalOutput += output;
            totalInput += input;

            stocker.set(machine, {
              c: prev.c + c,
              r: prev.r + r,
              output: prev.output + output,
              input: prev.input + input,
            });
          }
        }

        return {
          machines: [...stocker.entries()]
            .map(([id, { c, r, output, input }]) => ({
              id,
              name: machine_list[id].name,
              count: c,
              ratio: c > 1e-6 ? r / c : 0,
              output,
              input,
            }))
            .filter(({ count }) => count > 1e-6)
            .toSorted((a, b) => b.output - b.input - (a.output - a.input)),
          total: { input: totalInput, output: totalOutput },
        };
      })(),
      operation: [...range(z_max)].map((z) => ({
        zone_id: z,
        zone: `zone-${z}`,
        recipes: [...range(k_max)]
          .map((k) => ({
            machine: machine_list[recipes[k].machine].name,
            input: resource_ids
              .map((id) => [
                {
                  id,
                  name: resource_list[id].name,
                  volume: recipes[k].input[id] ?? 0,
                },
              ])
              .flat()
              .filter(({ id, volume }) => volume > 1e-6 && id !== "Power"),
            costs: resource_ids
              .map((id) => [
                {
                  id,
                  name: resource_list[id].name,
                  volume: recipes[k].fixed_costs[id] ?? 0,
                },
              ])
              .flat()
              .filter(({ id, volume }) => volume > 1e-6 && id !== "Power"),
            output: resource_ids
              .map((id) => [
                {
                  id,
                  name: resource_list[id].name,
                  volume: recipes[k].output[id] ?? 0,
                },
              ])
              .flat()
              .filter(({ volume }) => volume > 1e-6),
            count: result.columns.get(_c.get({ k, z })) ?? 0,
            ratio:
              (result.columns.get(_c.get({ k, z })) ?? 0) > 1e-6
                ? (result.columns.get(_r.get({ k, z })) ?? 0) /
                  (result.columns.get(_c.get({ k, z })) ?? 0)
                : 0,
          }))
          .filter(({ count }) => count > 1e-6)
          .toSorted((a, b) => b.count * b.ratio - a.count * a.ratio),
      })),
      flow: {
        nodes: [
          { id: "warehouse", name: "倉庫", kind: "Group" },
          ...[...range(z_max)].map((z) => ({
            id: `zone-${z}`,
            name: `zone-${z}`,
            kind: "Group",
          })),
          ...[...range(z_max)]
            .map((z) =>
              [...range(n_max)]
                .filter(
                  (n) =>
                    (result.columns.get(_out.get({ n, z })) ?? 0) +
                      (result.columns.get(_in.get({ n, z })) ?? 0) +
                      (result.columns.get(_fc.get({ n, z })) ?? 0) >
                    1e-6,
                )
                .map((n) => ({
                  id: `${resource_ids[n]}-${z}`,
                  name: resource_list[resource_ids[n]].name,
                  kind: "resource",
                  parent: `zone-${z}`,
                })),
            )
            .flat(),
          ...[...range(n_max)]
            .filter(
              (n) =>
                [...range(z_max)].reduce(
                  (acc, z) =>
                    acc + Math.abs(result.columns.get(_s.get({ n, z })) ?? 0),
                  0,
                ) > 1e-6,
            )
            .map((n) => ({
              id: `${resource_ids[n]}-w`,
              name: resource_list[resource_ids[n]].name,
              kind: "resource",
              parent: "warehouse",
            })),
          ...[...range(k_max)]
            .map((k) =>
              [...range(z_max)]
                .filter(
                  (z) => (result.columns.get(_r.get({ k, z })) ?? 0) > 1e-6,
                )
                .map((z) => ({
                  id: `recipe-${k}-${z}}`,
                  name: machine_list[recipes[k].machine].name,
                  kind: "machine",
                  parent: `zone-${z}`,
                })),
            )
            .flat(),
        ],
        edges: [
          ...[...range(n_max)]
            .map((n) =>
              [...range(z_max)]
                .filter(
                  (z) =>
                    resource_ids[n] !== "Power" &&
                    Math.abs(result.columns.get(_s.get({ n, z })) ?? 0) > 1e-6,
                )
                .map((z) => {
                  const s = result.columns.get(_s.get({ n, z })) ?? 0;
                  const rz = `${resource_ids[n]}-${z}`;
                  const rw = `${resource_ids[n]}-w`;
                  return s > 0
                    ? { source: rz, target: rw, kind: "output" }
                    : { source: rw, target: rz, kind: "input" };
                }),
            )
            .flat(),
          ...[...range(k_max)]
            .map((k) =>
              [...range(z_max)]
                .filter(
                  (z) => (result.columns.get(_r.get({ z, k })) ?? 0) > 1e-6,
                )
                .map((z) => {
                  const result: {
                    source: string;
                    target: string;
                    kind: string;
                  }[] = [];
                  for (const n of range(n_max)) {
                    if (
                      (recipes[k].input[resource_ids[n]] ?? 0) > 0 &&
                      resource_ids[n] !== "Power"
                    ) {
                      result.push({
                        source: `${resource_ids[n]}-${z}`,
                        target: `recipe-${k}-${z}}`,
                        kind: "input",
                      });
                    }
                    if (
                      (recipes[k].fixed_costs[resource_ids[n]] ?? 0) > 0 &&
                      resource_ids[n] !== "Power"
                    ) {
                      result.push({
                        source: `${resource_ids[n]}-${z}`,
                        target: `recipe-${k}-${z}}`,
                        kind: "costs",
                      });
                    }
                    if ((recipes[k].output[resource_ids[n]] ?? 0) > 0) {
                      result.push({
                        source: `recipe-${k}-${z}}`,
                        target: `${resource_ids[n]}-${z}`,
                        kind: "output",
                      });
                    }
                  }
                  return result;
                }),
            )
            .flat(2),
        ],
      },
    };
  }

  throw new Error("Unknown error.");
}
