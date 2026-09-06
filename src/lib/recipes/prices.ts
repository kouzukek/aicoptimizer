import type { AreaId } from "./areas";
import type { ResourceId } from "./resources";

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
};
