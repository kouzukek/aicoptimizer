import Highs, { type Model } from "highs";

import {
  machine_list,
  normalized_recipe_list,
  price_list,
  resource_ids,
  resource_list,
  type Quantities,
} from "./recipes";
import { type SolverRequest, type SolverResponse } from "./types";
import { range, format } from "./utils";

const DEBUG = false;

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
  public async solve(): Promise<Result> {
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
      time_limit: 30,
      presolve: "on",
      mip_rel_gap: 0,
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

export async function solve({
  area,
  additionalRequirements,
}: SolverRequest): Promise<SolverResponse> {
  const solver = new Solver();

  const { recipes: recipe_list, groups: limit_groups } = normalized_recipe_list;

  const n_max = resource_ids.length;
  const k_max = recipe_list.length;

  const _i = solver.createVars("i", { n: n_max });
  const _in = solver.createVars("_in", { n: n_max });
  const _out = solver.createVars("_out", { n: n_max });
  const _fc = solver.createVars("_fc", { n: n_max });

  const _c = solver.createVars("c", { k: k_max }, { type: "integer" });
  const _r = solver.createVars("r", { k: k_max });
  const _p = solver.createVars("p", { n: n_max });

  // sum(p{n})
  solver.setObjective(
    [...range(n_max)].map((n): Term[] => [[1, _p.get({ n })]]).flat(),
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

    // i{n} = out{n} - in{n} - fc{n}
    solver.addConstraint(
      [
        [1, _i.get({ n })],
        [-1, _out.get({ n })],
        [1, _in.get({ n })],
        [1, _fc.get({ n })],
      ],
      "=",
      0,
    );
    // (out/in/fc){n} = N * (r/c){k}
    solver.addConstraint(
      [
        [1, _out.get({ n })],
        ...[...range(k_max)].map((k): Term => [
          -1 * (recipe_list[k].output[id] ?? 0),
          _r.get({ k }),
        ]),
      ],
      "=",
      0,
    );
    solver.addConstraint(
      [
        [1, _in.get({ n })],
        ...[...range(k_max)].map((k): Term => [
          -1 * (recipe_list[k].input[id] ?? 0),
          _r.get({ k }),
        ]),
      ],
      "=",
      0,
    );
    solver.addConstraint(
      [
        [1, _fc.get({ n })],
        ...[...range(k_max)].map((k): Term => [
          -1 * (recipe_list[k].fixed_costs[id] ?? 0),
          _c.get({ k }),
        ]),
      ],
      "=",
      0,
    );
    // Prevent overflow
    if ("prevent_overflow" in resource && resource.prevent_overflow === true)
      solver.addConstraint([[1, _i.get({ n })]], "=", 0);
  }
  for (const k of range(k_max)) {
    // c-1 <= r <= c
    solver.addConstraint(
      [
        [1, _r.get({ k })],
        [-1, _c.get({ k })],
      ],
      "<=",
      0,
    );
    solver.addConstraint(
      [
        [1, _c.get({ k })],
        [-1, _r.get({ k })],
      ],
      "<=",
      1,
    );
  }

  {
    const terms: Term[] = [];
    for (const k of range(k_max)) {
      const raw = recipe_list[k].origin;
      if (raw.machine === "Thermal Bank") {
        const e = raw.output["Power"] ?? 0;
        terms.push([e, _c.get({ k })], [-e, _r.get({ k })]);
      }
    }
    solver.addConstraint(terms, "<=", 100000);
  }

  for (const group of limit_groups) {
    const name = group.name;
    const limit = group.limit[area];
    if (limit !== "inf")
      solver.addConstraint(
        [...range(k_max)].map((k) => [
          recipe_list[k].groups.includes(name) ? 1 : 0,
          _c.get({ k }),
        ]),
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
    if (min !== undefined || max !== undefined)
      _out.get({ n }).setOptions({ min, max });
  }

  const result = await solver.solve();

  if (result.status !== "Optimal")
    return {
      status: "Unoptimized",
      message: result.status,
      problem: result.problem,
    };

  const vars = {
    ...Object.fromEntries(
      Object.entries({ _i, _in, _out, _fc, _p }).map(([name, ref]) => [
        name,
        Object.fromEntries(
          [...range(n_max)].map((n) => [
            n,
            result.columns.get(ref.get({ n })) ?? 0,
          ]),
        ),
      ]),
    ),
    ...Object.fromEntries(
      Object.entries({ _r, _c }).map(([name, ref]) => [
        name,
        Object.fromEntries(
          [...range(k_max)].map((k) => [
            k,
            result.columns.get(ref.get({ k })) ?? 0,
          ]),
        ),
      ]),
    ),
  } as {
    _c: Record<number, number>;
    _in: Record<number, number>;
    _fc: Record<number, number>;
    _out: Record<number, number>;
    _r: Record<number, number>;
    _i: Record<number, number>;
    _p: Record<number, number>;
  };

  const ref = <T extends Record<string, number>>(
    vars: Variables<T>,
    indices: T,
  ) => result.columns.get(vars.get(indices)) ?? 0;

  return {
    objective: result.objective,
    problem: result.problem,
    status: "Optimal",
    vars,
    items: [...range(n_max)]
      .map((n) => {
        const id = resource_ids[n];
        return {
          index: n,
          id,
          name: resource_list[id].name,
          input: ref(_in, { n }),
          output: ref(_out, { n }),
          cost: ref(_fc, { n }),
          profit: ref(_p, { n }),
          balance: ref(_i, { n }),
        };
      })
      .filter(({ input, output, cost }) => input + output + cost >= 1e-6)
      .toSorted((a, b) => b.output - a.output),
    recipes: [...range(k_max)]
      .map((k) => {
        return {
          k,
          recipe: recipe_list[k],
          count: ref(_c, { k }),
          ratio: ref(_r, { k }),
        };
      })
      .filter(({ ratio }) => ratio >= 1e-6)
      .toSorted((a, b) => b.ratio - a.ratio)
      .map(({ k, count, ratio, recipe }) => {
        const parse = (q: Quantities) =>
          (
            Object.entries(q) as [
              keyof Quantities,
              Quantities[keyof Quantities],
            ][]
          ).map(([id, volume]) => ({
            id,
            name: resource_list[id].name,
            volume: volume ?? 0,
          }));
        return {
          count,
          ratio: ratio / count,
          index: k,
          input: parse(recipe.input),
          output: parse(recipe.output),
          cost: parse(recipe.fixed_costs),
          machine: {
            id: recipe.machine,
            name: machine_list[recipe.machine].name,
          },
        };
      }),
  };
}
