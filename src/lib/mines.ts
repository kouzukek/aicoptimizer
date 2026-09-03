import { type AreaId, type ResourceId, type Recipe } from "./recipes";

export type MineTemplates = {
  [A in AreaId]: {
    [R in ResourceId]?: { [T in string]: ((res: ResourceId) => Recipe)[] };
  };
};

const electricrig =
  (duration: number) =>
  (res: ResourceId): Recipe => ({
    input: {},
    output: { [res]: 1 },
    duration,
    machine: "Electric Mining Rig",
  });
const electricrigii =
  (duration: number) =>
  (res: ResourceId): Recipe => ({
    input: {},
    output: { [res]: 1 },
    duration,
    machine: "Electric Mining Rig Mk II",
  });
const hydrorig =
  (duration: number) =>
  (res: ResourceId): Recipe => ({
    input: { "Clean Water": 1 },
    output: { [res]: 1 },
    duration,
    machine: "Hydro Mining Rig",
  });
const gasextractor =
  (duration: number) =>
  (res: ResourceId): Recipe => ({
    input: {},
    output: { [res]: 1 },
    duration,
    machine: "Gas Extractor",
  });

export const mine_templates = {
  Valley: {
    "Originium Ore": {
      low: [electricrig(6), electricrigii(6)],
      high: [electricrig(3), electricrigii(3)],
    },
    "Amethyst Ore": {
      low: [electricrig(6), electricrigii(6)],
      high: [electricrig(3), electricrigii(3)],
    },
    "Ferrium Ore": {
      low: [electricrigii(6)],
      high: [electricrigii(3)],
    },
  },
  Wuling: {
    "Originium Ore": {
      low: [electricrig(6), electricrigii(6), hydrorig(6)],
      high: [electricrig(3), electricrigii(3), hydrorig(3)],
    },
    "Ferrium Ore": {
      low: [electricrigii(6), hydrorig(6)],
      high: [electricrigii(3), hydrorig(3)],
    },
    "Cuprium Ore": {
      low: [hydrorig(6)],
      high: [hydrorig(3)],
    },
    "Inergen": {
      low: [gasextractor(6)],
      high: [gasextractor(3)],
    },
    "Xiragen": {
      low: [gasextractor(6)],
      high: [gasextractor(3)],
    },
  },
} as const satisfies MineTemplates;

export type MiningPoints = {
  [P in AreaId]: {
    [R in keyof (typeof mine_templates)[P]]: {
      resourceId: R;
      slots: {
        [key in keyof (typeof mine_templates)[P][R]]?: number;
      };
    };
  }[keyof (typeof mine_templates)[P]][];
};

export const mining_points: MiningPoints = {
  Valley: [
    // 中枢エリア
    { resourceId: "Amethyst Ore", slots: { high: 6 } },
    { resourceId: "Ferrium Ore", slots: { high: 2 } },
    { resourceId: "Originium Ore", slots: { high: 5 } },
    { resourceId: "Originium Ore", slots: { high: 2 } },
    { resourceId: "Originium Ore", slots: { high: 5 } },
    { resourceId: "Originium Ore", slots: { high: 5 } },
    // 谷地通路
    { resourceId: "Amethyst Ore", slots: { high: 2 } },
    { resourceId: "Originium Ore", slots: { high: 5 } },
    // アブリー採石場
    { resourceId: "Amethyst Ore", slots: { high: 2 } },
    { resourceId: "Amethyst Ore", slots: { high: 2 } },
    // 源石研究パーク
    { resourceId: "Ferrium Ore", slots: { high: 2 } },
    { resourceId: "Ferrium Ore", slots: { high: 6 } },
    { resourceId: "Originium Ore", slots: { high: 2 } },
    { resourceId: "Originium Ore", slots: { high: 2 } },
    { resourceId: "Ferrium Ore", slots: { high: 5 } },
    // 鉱山エリア
    { resourceId: "Ferrium Ore", slots: { high: 5 } },
    { resourceId: "Ferrium Ore", slots: { high: 2 } },
    { resourceId: "Ferrium Ore", slots: { high: 2 } },
    { resourceId: "Ferrium Ore", slots: { high: 5 } },
    { resourceId: "Originium Ore", slots: { high: 2 } },
    { resourceId: "Ferrium Ore", slots: { high: 2 } },
    { resourceId: "Ferrium Ore", slots: { high: 2 } },
    // エネルギー高地
    { resourceId: "Ferrium Ore", slots: { high: 5 } },
    { resourceId: "Ferrium Ore", slots: { high: 2 } },
    { resourceId: "Ferrium Ore", slots: { high: 2 } },
    { resourceId: "Ferrium Ore", slots: { high: 2 } },
    { resourceId: "Ferrium Ore", slots: { high: 5 } },
    { resourceId: "Ferrium Ore", slots: { high: 5 } },
  ],
  Wuling: [
    // 景玉谷
    { resourceId: "Originium Ore", slots: { low: 2 } },
    { resourceId: "Originium Ore", slots: { high: 2, low: 3 } },
    { resourceId: "Originium Ore", slots: { high: 5 } },
    { resourceId: "Originium Ore", slots: { low: 2 } },
    { resourceId: "Inergen", slots: { high: 4 } },
    // 武陵城
    { resourceId: "Ferrium Ore", slots: { high: 6 } },
    { resourceId: "Originium Ore", slots: { high: 1, low: 1 } },
    { resourceId: "Originium Ore", slots: { high: 1, low: 1 } },
    { resourceId: "Originium Ore", slots: { high: 5 } },
    { resourceId: "Originium Ore", slots: { high: 1, low: 1 } },
    { resourceId: "Originium Ore", slots: { high: 5 } },
    { resourceId: "Inergen", slots: { high: 4 } },
    // 清波砦
    { resourceId: "Cuprium Ore", slots: { high: 6 } },
    { resourceId: "Cuprium Ore", slots: { high: 2 } },
    // 首礎
    { resourceId: "Cuprium Ore", slots: { high: 2 } },
    { resourceId: "Cuprium Ore", slots: { high: 2 } },
    { resourceId: "Inergen", slots: { high: 4 } },
    // 蔵剣谷
    { resourceId: "Cuprium Ore", slots: { high: 2 } },
    { resourceId: "Cuprium Ore", slots: { high: 2 } },
    // 実験区域
    { resourceId: "Cuprium Ore", slots: { high: 2 } },
    { resourceId: "Originium Ore", slots: { high: 2 } },
    // 応龍関
    { resourceId: "Inergen", slots: { high: 3 } },
    { resourceId: "Inergen", slots: { high: 6 } },
    // 北部閉鎖区域
    { resourceId: "Cuprium Ore", slots: { high: 1, low: 4 } },
    { resourceId: "Xiragen", slots: { high: 2 } },
    { resourceId: "Xiragen", slots: { high: 2 } },
    { resourceId: "Xiragen", slots: { high: 2 } },
    { resourceId: "Inergen", slots: { high: 2 } },
    // 雪松林
    { resourceId: "Cuprium Ore", slots: { high: 2 } },
    { resourceId: "Cuprium Ore", slots: { high: 2, low: 1 } },
    { resourceId: "Xiragen", slots: { high: 2, low: 1 } },
  ],
};
