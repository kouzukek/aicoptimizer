import type { AreaId } from "./areas";
import type { ResourceId } from "./resources";

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
  "Separating Unit": { name: "解体機", power_use: 20 },
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

  "Water Purifier": {
    name: "浄水装置",
    power_use: 0,
    limit: { Wuling: 3, Valley: 0 },
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
