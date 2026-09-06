export const area_list = {
  Wuling: { name: "武陵" },
  Valley: { name: "四号谷地" },
} as const satisfies Record<string, { name: string }>;
export type AreaId = keyof typeof area_list;
export const area_ids = Object.keys(area_list) as AreaId[];
