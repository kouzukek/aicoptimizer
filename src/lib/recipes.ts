import {
  type MineTemplates,
  type MiningPoints,
  mining_points,
  mine_templates,
} from "./mines.ts";

export const area_list = {
  Wuling: { name: "武陵" },
  Valley: { name: "四号谷地" },
} as const satisfies Record<string, { name: string }>;
export type AreaId = keyof typeof area_list;
export const area_ids = Object.keys(area_list) as AreaId[];

export const resource_list = {
  "Acridgen": { name: "酸性ガス", prevent_overflow: true },
  "Aketine Powder": { name: "アケトン粉末" },
  "Aketine Seed": { name: "アケトンの種" },
  "Aketine": { name: "アケトン樹木" },
  "Amethyst Bottle": { name: "紫晶製ボトル" },
  "Amethyst Component": { name: "紫晶装備部品" },
  "Amethyst Fiber": { name: "紫晶繊維" },
  "Amethyst Ore": { name: "紫晶鉱物" },
  "Amethyst Part": { name: "紫晶部品" },
  "Amethyst Powder": { name: "紫晶粉末" },
  "Aquagen": { name: "水蒸気" },
  "Buck Capsule [A]": { name: "蕎花カプセルⅢ" },
  "Buck Capsule [B]": { name: "蕎花カプセルⅡ" },
  "Buck Capsule [C]": { name: "蕎花カプセルⅠ" },
  "Buckflower Powder": { name: "蕎花粉末" },
  "Buckflower Seed": { name: "蕎花の種" },
  "Buckflower": { name: "蕎花" },
  "Canned Citrome [A]": { name: "シトロームの缶詰Ⅲ" },
  "Canned Citrome [B]": { name: "シトロームの缶詰Ⅱ" },
  "Canned Citrome [C]": { name: "シトロームの缶詰Ⅰ" },
  "Carbon Powder": { name: "炭塊粉末" },
  "Carbon": { name: "炭塊" },
  "Citrome Powder": { name: "シトローム粉末" },
  "Citrome Seed": { name: "シトロームの種" },
  "Citrome": { name: "シトローム" },
  "Clean Water": { name: "水", prevent_overflow: true },
  "Cryston Bottle": { name: "高晶製ボトル" },
  "Cryston Component": { name: "高晶装備部品" },
  "Cryston Fiber": { name: "高晶繊維" },
  "Cryston Part": { name: "高晶部品" },
  "Cryston Powder": { name: "高晶粉末" },
  "Cuprium Bottle (Jincao Solution)": { name: "赤銅ボトル(錦草エキス)" },
  "Cuprium Bottle (Yazhen Solution)": { name: "赤銅ボトル(芽針エキス)" },
  "Cuprium Bottle": { name: "赤銅ボトル" },
  "Cuprium Canister": { name: "赤銅圧力タンク" },
  "Cuprium Component": { name: "赤銅装備部品" },
  "Cuprium Gas": { name: "赤銅ガス", prevent_overflow: true },
  "Cuprium Ore": { name: "赤銅鉱物" },
  "Cuprium Part": { name: "赤銅部品" },
  "Cuprium Powder": { name: "赤銅粉末" },
  "Cuprium Solution": { name: "赤銅溶液", prevent_overflow: true },
  "Cuprium": { name: "赤銅塊" },
  "Dense Carbon Powder": { name: "高密度炭塊粉末" },
  "Dense Ferrium Powder": { name: "高密度青鉄粉末" },
  "Dense Originium Powder": { name: "高密度源石粉末" },
  "Dense Origocrust Powder": { name: "高密度結晶粉末" },
  "Ferrium Bottle (Jincao Solution)": { name: "青鉄製ボトル(錦草エキス)" },
  "Ferrium Bottle (Yazhen Solution)": { name: "青鉄製ボトル(芽針エキス)" },
  "Ferrium Bottle": { name: "青鉄製ボトル" },
  "Ferrium Component": { name: "青鉄装備部品" },
  "Ferrium Ore": { name: "青鉄鉱物" },
  "Ferrium Part": { name: "鉄製部品" },
  "Ferrium Powder": { name: "青鉄粉末" },
  "Ferrium": { name: "青鉄塊" },
  "Ground Buckflower Powder": { name: "蕎花細粉" },
  "Ground Citrome Powder": { name: "シトローム細粉" },
  "HC Valley Battery": { name: "大容量谷地バッテリー" },
  "Heavy Xiragen": { name: "重息壌ガス", prevent_overflow: true },
  "Heavy Xiranite": { name: "重息壌" },
  "Hetonite Bottle": { name: "緋銅ボトル" },
  "Hetonite Component": { name: "緋銅装備部品" },
  "Hetonite Gas": { name: "緋銅ガス", prevent_overflow: true },
  "Hetonite Part": { name: "緋銅部品" },
  "Hetonite Solution": { name: "緋銅溶液", prevent_overflow: true },
  "Hetonite": { name: "緋銅塊" },
  "Industrial Explosive": { name: "工業爆弾" },
  "Inergen": { name: "不活性ガス", prevent_overflow: true },
  "Inert Xircon Effluent": { name: "不活性壌晶廃液" },
  "Jincao Drink": { name: "錦草ソーダⅠ" },
  "Jincao Powder": { name: "錦草粉末" },
  "Jincao Seed": { name: "錦草の種" },
  "Jincao Solution": { name: "錦草エキス", prevent_overflow: true },
  "Jincao Tea": { name: "錦草ソーダⅡ" },
  "Jincao": { name: "錦草" },
  "LC Valley Battery": { name: "小容量谷地バッテリー" },
  "LC Wuling Battery": { name: "小容量武陵バッテリー" },
  "Liquid Heavy Xiranite": { name: "液化重息壌" },
  "Liquid Xiranite": { name: "液化息壌" },
  "Originium Ore": { name: "源石鉱物" },
  "Originium Powder": { name: "源石粉末" },
  "Origocrust Powder": { name: "結晶外殻粉末" },
  "Origocrust": { name: "結晶外殻" },
  "Packed Origocrust": { name: "特製結晶" },
  "Power": { name: "電力" },
  "Precipitation Acid": { name: "沈殿酸", prevent_overflow: true },
  "Pyrrolite Component": { name: "焔銅装備部品" },
  "Pyrrolite Gas": { name: "焔銅ガス", prevent_overflow: true },
  "Pyrrolite Part": { name: "焔銅部品" },
  "Pyrrolite": { name: "焔銅塊" },
  "Sandleaf Powder": { name: "サンドリーフ粉末" },
  "Sandleaf Seed": { name: "サンドリーフの種" },
  "Sandleaf": { name: "サンドリーフ" },
  "SC Valley Battery": { name: "中容量谷地バッテリー" },
  "SC Wuling Battery": { name: "中容量武陵バッテリー" },
  "Separator Core": { name: "分離コア" },
  "Sewage": { name: "汚水", prevent_overflow: true },
  "Stabilized Carbon": { name: "安定炭塊" },
  "Steel Bottle": { name: "鋼製ボトル" },
  "Steel Part": { name: "鋼製部品" },
  "Steel": { name: "鋼" },
  "Xiragen": { name: "息壌ガス", prevent_overflow: true },
  "Xiranite Component": { name: "息壌装備部品" },
  "Xiranite": { name: "息壌" },
  "Xircon Effluent": { name: "壌晶廃液", prevent_overflow: true },
  "Xircon": { name: "壌晶" },
  "Yazhen Powder": { name: "芽針粉末" },
  "Yazhen Seed": { name: "芽針の種" },
  "Yazhen Solution": { name: "芽針エキス", prevent_overflow: true },
  "Yazhen Syringe [A]": { name: "芽針注射剤Ⅱ" },
  "Yazhen Syringe [C]": { name: "芽針注射剤Ⅰ" },
  "Yazhen": { name: "芽針" },
} as const satisfies Record<
  string,
  { name: string; prevent_overflow?: boolean }
>;
export type ResourceId = keyof typeof resource_list;
export const resource_ids = Object.keys(resource_list) as ResourceId[];

export interface Group {
  [key: string]: ResourceId[] | Group;
}
export const resource_group: Group = {
  Power: ["Power"],
  Ores: ["Originium Ore", "Amethyst Ore", "Ferrium Ore", "Cuprium Ore"],
  Liquids: ["Clean Water", "Precipitation Acid"],
  Gasses: ["Inergen", "Xiragen"],
  Plants: ["Buckflower", "Citrome", "Aketine", "Sandleaf", "Yazhen", "Jincao"],
  Products: {
    Parts: [
      "Origocrust",
      "Amethyst Part",
      "Ferrium Part",
      "Steel Part",
      "Cryston Part",
      "Cuprium Part",
      "Hetonite Part",
      "Pyrrolite Part",
      "Xiranite",
      "Heavy Xiranite",
    ],
    Bottles: [
      "Amethyst Bottle",
      "Cryston Bottle",
      "Ferrium Bottle",
      "Steel Bottle",
      "Cuprium Bottle",
      "Hetonite Bottle",
      "Cuprium Canister",
    ],
    Components: [
      "Amethyst Component",
      "Ferrium Component",
      "Cryston Component",
      "Hetonite Component",
      "Xiranite Component",
      "Cuprium Component",
      "Pyrrolite Component",
    ],
    Medicines: [
      "Buck Capsule [C]",
      "Buck Capsule [B]",
      "Buck Capsule [A]",
      "Canned Citrome [C]",
      "Canned Citrome [B]",
      "Canned Citrome [A]",
      "Yazhen Syringe [C]",
      "Yazhen Syringe [A]",
      "Jincao Drink",
      "Jincao Tea",
    ],
    Batteries: [
      "Originium Ore",
      "LC Valley Battery",
      "SC Valley Battery",
      "HC Valley Battery",
      "LC Wuling Battery",
      "SC Wuling Battery",
    ],
    Miscs: ["Industrial Explosive"],
  },
  All: resource_ids.toSorted((a, b) =>
    resource_list[a].name.localeCompare(resource_list[b].name, "ja"),
  ),
} as const satisfies Group;

export const price_list: Record<AreaId, { [key in ResourceId]?: number }> = {
  Wuling: {
    "Xiranite": 1,
    "Heavy Xiranite": 27,
    "LC Wuling Battery": 25,
    "SC Wuling Battery": 54,
    "Jincao Drink": 16,
    "Jincao Tea": 22,
    "Yazhen Syringe [C]": 16,
    "Yazhen Syringe [A]": 22,
    "Cuprium Part": 1,
    "Hetonite Part": 48,
    "Pyrrolite Part": 70,
    "Separator Core": 1,
  },
  Valley: {
    "LC Valley Battery": 16,
    "SC Valley Battery": 30,
    "HC Valley Battery": 70,
    "Buck Capsule [C]": 10,
    "Buck Capsule [B]": 27,
    "Buck Capsule [A]": 70,
    "Canned Citrome [C]": 10,
    "Canned Citrome [B]": 27,
    "Canned Citrome [A]": 70,
    "Origocrust": 1,
    "Amethyst Part": 1,
    "Ferrium Part": 1,
    "Steel Part": 3,
  },
} as const;

type MachineParams = {
  power_use: number;
  name: string;
  limit?: { [key in AreaId]: number | "inf" };
  aux?: { [key in ResourceId]?: { count: number; duration: number } };
};
const _machine_list = {
  "Hydro Mining Rig": {
    name: "水力採鉱機",
    power_use: 0,
  },
  "Gas Extractor": {
    name: "ガス収集ポンプ",
    power_use: 0,
  },
  "Electric Mining Rig": { name: "電動採鉱機", power_use: 5 },
  "Electric Mining Rig Mk II": {
    name: "電動採鉱機Ⅱ",
    power_use: 10,
  },

  "Planting Unit": {
    name: "栽培機",
    power_use: 20,
  },
  "Seed-Picking Unit": {
    name: "採種機",
    power_use: 10,
  },
  "Fitting Unit": {
    name: "組立機",
    power_use: 20,
  },
  "Moulding Unit": {
    name: "成形機",
    power_use: 10,
  },
  "Refining Unit": {
    name: "精錬炉",
    power_use: 5,
  },
  "Shredding Unit": {
    name: "粉砕機",
    power_use: 5,
  },
  "Fluid Supply Unit": {
    name: "排水機",
    power_use: 10,
  },
  "Water Treatment Unit": {
    name: "廃水処理機",
    power_use: 50,
  },
  "Fluid Pump": {
    name: "液体ポンプ",
    power_use: 10,
  },
  "Acid Resistant Pump Mk II": {
    name: "耐酸性液体ポンプⅡ",
    power_use: 20,
  },

  "Fluid-Gas Transmuting Unit": {
    name: "ガス液体転換機",
    power_use: 50,
    aux: { "Liquid Xiranite": { count: 6, duration: 60 } },
  },
  "Gas Reactor Globe": {
    name: "ガス反応装置",
    power_use: 50,
  },
  "Purification Unit": {
    name: "精製機",
    power_use: 50,
  },
  "Solid-Gas Transmuting Unit": {
    name: "ガス固体転換機",
    power_use: 50,
    aux: { Xiragen: { count: 6, duration: 60 } },
  },
  "Reactor Crucible": {
    name: "化学反応炉",
    power_use: 50,
  },
  "Packaging Unit": {
    name: "包装機",
    power_use: 20,
  },
  "Filling Unit": {
    name: "充填機",
    power_use: 20,
  },
  "Forge of the Sky": {
    name: "天有洪炉",
    power_use: 50,
    limit: { Wuling: 12, Valley: 0 },
  },
  "Grinding Unit": {
    name: "研磨機",
    power_use: 50,
  },
  "Gearing Unit": {
    name: "装備部品加工機",
    power_use: 10,
  },

  "Thermal Bank": {
    name: "発電機",
    power_use: 0,
  },
  "Protocol Automation-Core": {
    name: "協約核心",
    power_use: 0,
    limit: { Wuling: 1, Valley: 1 },
  },
} as const satisfies Record<string, MachineParams>;
export type MachineId = keyof typeof _machine_list;
export const machine_ids = Object.keys(_machine_list) as MachineId[];
export const machine_list: Record<MachineId, MachineParams> = _machine_list;

type Environment = "Stable" | "Acrid";
export type Quantities = { [key in ResourceId]?: number };
export type Recipe = {
  input: Quantities;
  output: Quantities;
  duration: number;
  environment?: Environment;
  machine: MachineId;
  limit?: { [key in AreaId]: number | "inf" };
};

export const recipe_list: Recipe[] = [
  {
    input: {},
    output: { "Clean Water": 1 },
    duration: 1,
    limit: { Wuling: "inf", Valley: 0 },
    machine: "Fluid Pump",
  },
  {
    input: {},
    output: { "Precipitation Acid": 1 },
    duration: 2,
    limit: { Wuling: "inf", Valley: 0 },
    machine: "Acid Resistant Pump Mk II",
  },
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
  {
    input: { Ferrium: 1 },
    output: { "Ferrium Part": 1 },
    duration: 2,
    machine: "Fitting Unit",
  },
  {
    input: { "Amethyst Fiber": 1 },
    output: { "Amethyst Part": 1 },
    duration: 2,
    machine: "Fitting Unit",
  },
  {
    input: { Steel: 1 },
    output: { "Steel Part": 1 },
    duration: 2,
    machine: "Fitting Unit",
  },
  {
    input: { "Cryston Fiber": 1 },
    output: { "Cryston Part": 1 },
    duration: 2,
    machine: "Fitting Unit",
  },
  {
    input: { Cuprium: 1 },
    output: { "Cuprium Part": 1 },
    duration: 2,
    machine: "Fitting Unit",
  },
  {
    input: { Hetonite: 5 },
    output: { "Hetonite Part": 1 },
    duration: 10,
    machine: "Fitting Unit",
  },
  {
    input: { Pyrrolite: 5 },
    output: { "Pyrrolite Part": 1 },
    duration: 10,
    machine: "Fitting Unit",
  },
  {
    input: { Ferrium: 2 },
    output: { "Ferrium Bottle": 1 },
    duration: 2,
    machine: "Moulding Unit",
  },
  {
    input: { "Amethyst Fiber": 2 },
    output: { "Amethyst Bottle": 1 },
    duration: 2,
    machine: "Moulding Unit",
  },
  {
    input: { Steel: 2 },
    output: { "Steel Bottle": 1 },
    duration: 2,
    machine: "Moulding Unit",
  },
  {
    input: { "Cryston Fiber": 2 },
    output: { "Cryston Bottle": 1 },
    duration: 2,
    machine: "Moulding Unit",
  },
  {
    input: { Cuprium: 2 },
    output: { "Cuprium Bottle": 1 },
    duration: 2,
    machine: "Moulding Unit",
  },
  {
    input: { Hetonite: 2 },
    output: { "Hetonite Bottle": 1 },
    duration: 2,
    machine: "Moulding Unit",
  },
  {
    input: { Cuprium: 2, Inergen: 1 },
    output: { "Cuprium Canister": 1 },
    duration: 2,
    machine: "Moulding Unit",
  },
  {
    input: { "Ferrium Ore": 1 },
    output: { Ferrium: 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Ferrium Powder": 1 },
    output: { Ferrium: 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Amethyst Ore": 1 },
    output: { "Amethyst Fiber": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Amethyst Powder": 1 },
    output: { "Amethyst Fiber": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Originium Ore": 1 },
    output: { Origocrust: 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Origocrust Powder": 1 },
    output: { Origocrust: 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Dense Origocrust Powder": 1 },
    output: { "Packed Origocrust": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Dense Ferrium Powder": 1 },
    output: { Steel: 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Cryston Powder": 1 },
    output: { "Cryston Fiber": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Dense Carbon Powder": 1 },
    output: { "Stabilized Carbon": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Dense Originium Powder": 1 },
    output: { "Dense Origocrust Powder": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Originium Powder": 1 },
    output: { "Origocrust Powder": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { Yazhen: 1 },
    output: { Carbon: 2 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { Jincao: 1 },
    output: { Carbon: 2 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { Buckflower: 1 },
    output: { Carbon: 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { Citrome: 1 },
    output: { Carbon: 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { Sandleaf: 1 },
    output: { Carbon: 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Yazhen Powder": 1 },
    output: { "Carbon Powder": 2 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Jincao Powder": 1 },
    output: { "Carbon Powder": 2 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Sandleaf Powder": 3 },
    output: { "Carbon Powder": 2 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Buckflower Powder": 1 },
    output: { "Carbon Powder": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Citrome Powder": 1 },
    output: { "Carbon Powder": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Ground Buckflower Powder": 1 },
    output: { "Dense Carbon Powder": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Ground Citrome Powder": 1 },
    output: { "Dense Carbon Powder": 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { "Cuprium Ore": 1, "Clean Water": 1 },
    output: { Cuprium: 1, Sewage: 1 },
    duration: 2,
    machine: "Refining Unit",
  },
  {
    input: { Cuprium: 1 },
    output: { "Cuprium Powder": 1 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Ferrium: 1 },
    output: { "Ferrium Powder": 1 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { "Amethyst Fiber": 1 },
    output: { "Amethyst Powder": 1 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { "Originium Ore": 1 },
    output: { "Originium Powder": 1 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Carbon: 1 },
    output: { "Carbon Powder": 2 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Origocrust: 1 },
    output: { "Origocrust Powder": 1 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Buckflower: 1 },
    output: { "Buckflower Powder": 2 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Citrome: 1 },
    output: { "Citrome Powder": 2 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Sandleaf: 1 },
    output: { "Sandleaf Powder": 3 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Aketine: 1 },
    output: { "Aketine Powder": 2 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Jincao: 1 },
    output: { "Jincao Powder": 2 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Yazhen: 1 },
    output: { "Yazhen Powder": 2 },
    duration: 2,
    machine: "Shredding Unit",
  },
  {
    input: { Sewage: 1 },
    output: {},
    duration: 2,
    machine: "Water Treatment Unit",
  },
  {
    input: { "Xircon Effluent": 1 },
    output: {},
    duration: 2,
    machine: "Water Treatment Unit",
  },
  {
    input: { "Inert Xircon Effluent": 1 },
    output: {},
    duration: 2,
    machine: "Water Treatment Unit",
  },
  {
    input: { "Clean Water": 3 },
    output: {},
    duration: 1,
    machine: "Fluid Supply Unit",
  },
  {
    input: { "Precipitation Acid": 3 },
    output: {},
    duration: 1,
    machine: "Fluid Supply Unit",
  },

  {
    input: { "Clean Water": 1 },
    output: { Aquagen: 1 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { Aquagen: 1 },
    output: { "Clean Water": 1 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { Acridgen: 1 },
    output: { "Precipitation Acid": 1 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { "Precipitation Acid": 1 },
    output: { Acridgen: 1 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { "Liquid Xiranite": 1 },
    output: { Xiragen: 1 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { Xiragen: 1 },
    output: { "Liquid Xiranite": 1 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { "Liquid Heavy Xiranite": 2 },
    output: { "Heavy Xiragen": 5 },
    duration: 10,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { "Heavy Xiragen": 5 },
    output: { "Liquid Heavy Xiranite": 2 },
    duration: 10,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { "Cuprium Gas": 1 },
    output: { "Cuprium Solution": 2 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { "Cuprium Solution": 2 },
    output: { "Cuprium Gas": 1 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { "Hetonite Gas": 1 },
    output: { "Hetonite Solution": 1 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },
  {
    input: { "Hetonite Solution": 1 },
    output: { "Hetonite Gas": 1 },
    duration: 2,
    machine: "Fluid-Gas Transmuting Unit",
  },

  {
    input: { "Hetonite Gas": 2, "Xiragen": 1 },
    output: { "Pyrrolite Gas": 1 },
    duration: 2,
    environment: "Acrid",
    machine: "Gas Reactor Globe",
  },

  {
    input: { "Ferrium Powder": 2, "Sandleaf Powder": 1 },
    output: { "Dense Ferrium Powder": 1 },
    duration: 2,
    machine: "Grinding Unit",
  },
  {
    input: { "Amethyst Powder": 2, "Sandleaf Powder": 1 },
    output: { "Cryston Powder": 1 },
    duration: 2,
    machine: "Grinding Unit",
  },
  {
    input: { "Originium Powder": 2, "Sandleaf Powder": 1 },
    output: { "Dense Originium Powder": 1 },
    duration: 2,
    machine: "Grinding Unit",
  },
  {
    input: { "Carbon Powder": 2, "Sandleaf Powder": 1 },
    output: { "Dense Carbon Powder": 1 },
    duration: 2,
    machine: "Grinding Unit",
  },
  {
    input: { "Origocrust Powder": 2, "Sandleaf Powder": 1 },
    output: { "Dense Origocrust Powder": 1 },
    duration: 2,
    machine: "Grinding Unit",
  },
  {
    input: { "Buckflower Powder": 2, "Sandleaf Powder": 1 },
    output: { "Ground Buckflower Powder": 1 },
    duration: 2,
    machine: "Grinding Unit",
  },
  {
    input: { "Citrome Powder": 2, "Sandleaf Powder": 1 },
    output: { "Ground Citrome Powder": 1 },
    duration: 2,
    machine: "Grinding Unit",
  },

  {
    input: { "Inert Xircon Effluent": 4 },
    output: { "Xircon Effluent": 1, "Clean Water": 1 },
    duration: 2,
    machine: "Purification Unit",
  },
  {
    input: { "Cuprium Solution": 4 },
    output: { "Hetonite Solution": 1, "Precipitation Acid": 1 },
    duration: 2,
    machine: "Purification Unit",
  },
  {
    input: { "Xiragen": 2, "Separator Core": 1 },
    output: { "Heavy Xiragen": 1 },
    duration: 2,
    environment: "Stable",
    machine: "Purification Unit",
  },
  {
    input: { "Cuprium Gas": 2, "Separator Core": 1 },
    output: { "Hetonite Gas": 2 },
    duration: 2,
    environment: "Stable",
    machine: "Purification Unit",
  },
  {
    input: { "Xiragen": 2, "Separator Core": 2 },
    output: { "Heavy Xiragen": 1 },
    duration: 2,
    machine: "Purification Unit",
  },
  {
    input: { "Cuprium Gas": 2, "Separator Core": 2 },
    output: { "Hetonite Gas": 2 },
    duration: 2,
    machine: "Purification Unit",
  },

  {
    input: { Xiragen: 1 },
    output: { Xiranite: 1 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { "Heavy Xiragen": 5 },
    output: { "Heavy Xiranite": 2 },
    duration: 10,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { "Cuprium Gas": 1 },
    output: { Cuprium: 2 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { "Hetonite Gas": 2 },
    output: { Hetonite: 1 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { "Pyrrolite Gas": 1 },
    output: { Pyrrolite: 1 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { Xiranite: 1 },
    output: { Xiragen: 1 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { "Heavy Xiranite": 2 },
    output: { "Heavy Xiragen": 5 },
    duration: 10,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { Cuprium: 2 },
    output: { "Cuprium Gas": 1 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { Hetonite: 1 },
    output: { "Hetonite Gas": 2 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },
  {
    input: { Pyrrolite: 1 },
    output: { "Pyrrolite Gas": 1 },
    duration: 2,
    machine: "Solid-Gas Transmuting Unit",
  },

  {
    input: { "Jincao Powder": 1, "Clean Water": 1 },
    output: { "Jincao Solution": 1 },
    duration: 2,
    machine: "Reactor Crucible",
  },
  {
    input: { "Yazhen Powder": 1, "Clean Water": 1 },
    output: { "Yazhen Solution": 1 },
    duration: 2,
    machine: "Reactor Crucible",
  },
  {
    input: { "Xiranite": 1, "Clean Water": 1 },
    output: { "Liquid Xiranite": 1 },
    duration: 2,
    machine: "Reactor Crucible",
  },
  {
    input: { "Heavy Xiranite": 1, "Precipitation Acid": 1 },
    output: { "Liquid Heavy Xiranite": 1 },
    duration: 2,
    machine: "Reactor Crucible",
  },
  {
    input: { "Cuprium Powder": 1, "Precipitation Acid": 1 },
    output: { "Cuprium Solution": 1 },
    duration: 2,
    machine: "Reactor Crucible",
  },
  {
    input: { "Liquid Xiranite": 1, "Sewage": 1 },
    output: { "Xircon Effluent": 1, "Inert Xircon Effluent": 1 },
    duration: 2,
    machine: "Reactor Crucible",
  },
  {
    input: { "Xircon Effluent": 2, "Ferrium Powder": 1 },
    output: { Xircon: 1, Sewage: 1 },
    duration: 2,
    machine: "Reactor Crucible",
  },
  {
    input: { "Hetonite Solution": 2, "Ferrium Powder": 1 },
    output: { Hetonite: 1, Sewage: 1 },
    duration: 2,
    machine: "Reactor Crucible",
  },

  {
    input: { "Amethyst Part": 5, "Aketine Powder": 1 },
    output: { "Industrial Explosive": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Amethyst Part": 5, "Originium Powder": 10 },
    output: { "LC Valley Battery": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Ferrium Part": 10, "Originium Powder": 15 },
    output: { "SC Valley Battery": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Steel Part": 10, "Dense Originium Powder": 15 },
    output: { "HC Valley Battery": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Ferrium Part": 10, "Ferrium Bottle (Yazhen Solution)": 5 },
    output: { "Yazhen Syringe [C]": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Cuprium Part": 10, "Cuprium Bottle (Yazhen Solution)": 5 },
    output: { "Yazhen Syringe [A]": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Ferrium Part": 10, "Ferrium Bottle (Jincao Solution)": 5 },
    output: { "Jincao Drink": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Cuprium Part": 10, "Cuprium Bottle (Jincao Solution)": 5 },
    output: { "Jincao Tea": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Xiranite": 5, "Dense Originium Powder": 15 },
    output: { "LC Wuling Battery": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Xircon": 5, "Dense Originium Powder": 20 },
    output: { "SC Wuling Battery": 1 },
    duration: 10,
    machine: "Packaging Unit",
  },
  {
    input: { "Cuprium Canister": 1, "Xiranite": 1 },
    output: { "Separator Core": 2 },
    duration: 2,
    machine: "Packaging Unit",
  },

  {
    input: { "Ferrium Bottle": 1, "Yazhen Solution": 1 },
    output: { "Ferrium Bottle (Yazhen Solution)": 1 },
    duration: 2,
    machine: "Filling Unit",
  },
  {
    input: { "Cuprium Bottle": 1, "Yazhen Solution": 1 },
    output: { "Cuprium Bottle (Yazhen Solution)": 1 },
    duration: 2,
    machine: "Filling Unit",
  },
  {
    input: { "Ferrium Bottle": 1, "Jincao Solution": 1 },
    output: { "Ferrium Bottle (Jincao Solution)": 1 },
    duration: 2,
    machine: "Filling Unit",
  },
  {
    input: { "Cuprium Bottle": 1, "Jincao Solution": 1 },
    output: { "Cuprium Bottle (Jincao Solution)": 1 },
    duration: 2,
    machine: "Filling Unit",
  },
  {
    input: { "Amethyst Bottle": 5, "Citrome Powder": 5 },
    output: { "Canned Citrome [C]": 1 },
    duration: 10,
    machine: "Filling Unit",
  },
  {
    input: { "Ferrium Bottle": 10, "Citrome Powder": 10 },
    output: { "Canned Citrome [B]": 1 },
    duration: 10,
    machine: "Filling Unit",
  },
  {
    input: { "Steel Bottle": 10, "Ground Citrome Powder": 10 },
    output: { "Canned Citrome [A]": 1 },
    duration: 10,
    machine: "Filling Unit",
  },
  {
    input: { "Amethyst Bottle": 5, "Buckflower Powder": 5 },
    output: { "Buck Capsule [C]": 1 },
    duration: 10,
    machine: "Filling Unit",
  },
  {
    input: { "Ferrium Bottle": 10, "Buckflower Powder": 10 },
    output: { "Buck Capsule [B]": 1 },
    duration: 10,
    machine: "Filling Unit",
  },
  {
    input: { "Steel Bottle": 10, "Ground Buckflower Powder": 10 },
    output: { "Buck Capsule [A]": 1 },
    duration: 10,
    machine: "Filling Unit",
  },

  {
    input: { "Carbon": 1, "Clean Water": 1 },
    output: { Xiranite: 1 },
    duration: 2,
    environment: "Stable",
    machine: "Forge of the Sky",
  },
  {
    input: { "Stabilized Carbon": 2, "Clean Water": 1 },
    output: { Xiranite: 1 },
    duration: 2,
    machine: "Forge of the Sky",
  },
  {
    input: { "Xiranite": 10, "Xircon Effluent": 5 },
    output: { "Heavy Xiranite": 1 },
    duration: 10,
    machine: "Forge of the Sky",
  },

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

export type NormalizedRecipes = {
  recipes: (Omit<Recipe, "limit"> & {
    groups: string[];
    fixed_costs: Quantities;
    origin: Recipe;
  })[];
  groups: { name: string; limit: { [key in AreaId]: number | "inf" } }[];
};

const normalize_recipe = (
  r: Recipe,
): Omit<NormalizedRecipes["recipes"][number], "groups"> => {
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

  return { ...r, input, output, fixed_costs, duration: 60, origin: r };
};

const normalize_recipes = (array: Recipe[]): NormalizedRecipes => {
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

const normalize_mining_points = (
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

const concat_normalized_recipes = (...args: NormalizedRecipes[]) =>
  args.reduce(
    (acc, cur) => ({
      recipes: [...acc.recipes, ...cur.recipes],
      groups: [...acc.groups, ...cur.groups],
    }),
    { recipes: [], groups: [] },
  );

export const normalized_recipe_list = concat_normalized_recipes(
  normalize_recipes(recipe_list),
  normalize_mining_points(mine_templates, mining_points),
);
