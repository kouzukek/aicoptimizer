import { useAtom, useAtomValue } from "jotai";

import {
  area_ids,
  area_list,
  price_list,
  resource_ids,
  resource_list,
} from "../../lib/recipes";
import { areaAtom } from "../../lib/store";

import { AdditionalRequirements } from "./requirements";
import { TabsPanel } from "../../components/tabs";

import styles from "./styles.module.scss";

const AreaSelector = () => {
  const [area, setArea] = useAtom(areaAtom);

  return (
    <>
      <TabsPanel
        withoutPanel
        tabs={area_ids.map((id) => [id, area_list[id].name])}
        value={area}
        onValueChange={setArea}
        rootClass={styles.tabs}
      />
      <div data-area={area} className={styles.data_holder} />
    </>
  );
};

const SaleableItems = () => {
  const area = useAtomValue(areaAtom);

  return (
    <table aria-label="Saleable Items">
      <thead>
        <tr>
          <th scope="col">名称</th>
          <th scope="col">価格</th>
        </tr>
      </thead>
      <tbody>
        {resource_ids
          .map((id) => [id, price_list[area][id]] as const)
          .filter(([, price]) => price)
          .toSorted((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
          .map(([id, price]) => (
            <tr key={id}>
              <td>{resource_list[id].name}</td>
              <td data-type="price">{price}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export const Plan = () => {
  return (
    <>
      <h2>PLANNING</h2>
      <h3>地域</h3>
      <AreaSelector />
      <h3>拠点取引品目</h3>
      <SaleableItems />
      <h3>追加指示</h3>
      <AdditionalRequirements />
    </>
  );
};
