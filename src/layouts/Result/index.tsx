import { Fragment } from "react";
import { useAtomValue } from "jotai";

import { resultAtom } from "../../lib/store";
import { format } from "../../lib/utils";

import { TabsPanel } from "../../components/tabs";
import { Graph } from "../Graph";

import styles from "./styles.module.scss";

const Profits = () => {
  const result = useAtomValue(resultAtom);
  const succeed = result.status === "Optimal";

  return (
    <table aria-label="Profits">
      <thead>
        <tr>
          <th scope="col">品目</th>
          <th scope="col">数量</th>
          <th scope="col">単価</th>
          <th scope="col">金額</th>
        </tr>
      </thead>
      {succeed && (
        <>
          <tbody>
            {result.profits?.items.map(({ id, name, count, profit }) => (
              <tr key={id}>
                <td>{name}</td>
                <td data-type="volume">{format(count, 1)}</td>
                <td data-type="price">
                  {format(profit >= 1e-6 ? profit / count : 0)}
                </td>
                <td data-type="money">{format(profit, 1)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th />
              <th />
              <th />
              <th data-type="money">
                Σ {format(result.profits?.totalProfit ?? 0, 1)}
              </th>
            </tr>
          </tfoot>
        </>
      )}
    </table>
  );
};

const Balances = () => {
  const result = useAtomValue(resultAtom);
  const succeed = result.status === "Optimal";

  return (
    <table aria-label="Resource Balances">
      <thead>
        <tr>
          <th scope="col">品目</th>
          <th scope="col">生産</th>
          <th scope="col">消費</th>
          <th scope="col">増減</th>
        </tr>
      </thead>
      {succeed && (
        <tbody>
          {result.balance?.map(({ zone, zone_id, items }) => (
            <Fragment key={`zone-${zone_id}`}>
              <tr>
                <th colSpan={4}>{zone}</th>
              </tr>
              {items.map(({ id, name, output, input, balance }) => (
                <tr key={`item-${id}`}>
                  <td>{name}</td>
                  <td data-type="volume">{format(output, 1)}</td>
                  <td data-type="volume">{format(input, 1)}</td>
                  <td data-type="volume">{format(balance, 1)}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      )}
    </table>
  );
};

const PowerConsumption = () => {
  const result = useAtomValue(resultAtom);
  const succeed = result.status === "Optimal";

  return (
    <table aria-label="Power Balances">
      <thead>
        <tr>
          <th scope="col">設備</th>
          <th scope="col">台数</th>
          <th scope="col">稼働率</th>
          <th scope="col">出力</th>
          <th scope="col">入力</th>
        </tr>
      </thead>
      {succeed && (
        <>
          <tbody>
            {result.power?.machines.map(
              ({ id, name, count, ratio, output, input }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td data-type="count">{format(count)}</td>
                  <td data-type="ratio">{format(ratio * 100)}</td>
                  <td data-type="volume">{format(output)}</td>
                  <td data-type="volume">{format(input)}</td>
                </tr>
              ),
            )}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3}></th>
              <th scope="col" data-type="volume">
                {format(result.power?.total.output ?? 0)}
              </th>
              <th scope="col" data-type="volume">
                {format(result.power?.total.input ?? 0)}
              </th>
            </tr>
          </tfoot>
        </>
      )}
    </table>
  );
};

const RecipeOperationRatio = () => {
  const result = useAtomValue(resultAtom);
  const succeed = result.status === "Optimal";

  return (
    <table aria-label="Recipe Operation Ratio">
      <thead>
        <tr>
          <th scope="col">設備</th>
          <th scope="col">入力</th>
          <th scope="col">出力</th>
          <th scope="col">台数</th>
          <th scope="col">稼働率</th>
        </tr>
      </thead>
      {succeed && (
        <tbody>
          {result.operation?.map(({ zone_id, zone, recipes }) => (
            <Fragment key={`zone-${zone_id}`}>
              <tr>
                <th colSpan={5}>{zone}</th>
              </tr>
              {recipes.map(
                ({ machine, input, costs, output, count, ratio }, i) => (
                  <tr key={`zone-${zone_id} recipe-${i}`}>
                    <td>{machine}</td>
                    <td>
                      <div className={styles.recipe_resources_stack}>
                        {input.map(({ id, name, volume }) => (
                          <div key={`input-${id}`}>
                            <div>{name}</div>
                            <div data-type="volume">{format(volume, 0, 1)}</div>
                          </div>
                        ))}
                        {costs.map(({ id, name, volume }) => (
                          <div key={`costs-${id}`}>
                            <div>{name}</div>
                            <div data-type="volume">{format(volume, 0, 1)}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className={styles.recipe_resources_stack}>
                        {output.map(({ id, name, volume }) => (
                          <div key={`output-${id}`}>
                            <div>{name}</div>
                            <div data-type="volume">{format(volume, 0, 1)}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td data-type="count">{format(count)}</td>
                    <td data-type="ratio">{format(ratio * 100)}</td>
                  </tr>
                ),
              )}
            </Fragment>
          ))}
        </tbody>
      )}
    </table>
  );
};

const GraphArea = () => {
  const result = useAtomValue(resultAtom);

  return (
    result.status === "Optimal" && (
      <div className={styles.grapharea}>
        <Graph nodes={result.flow.nodes} edges={result.flow.edges} />
      </div>
    )
  );
};

export const Result = () => {
  return (
    <>
      <h2>RESULTS</h2>
      <TabsPanel
        tabs={[
          /* oxlint-disable react/jsx-key */
          ["profits", <h3>拠点取引</h3>, <Profits />],
          ["balance", <h3>資源収支</h3>, <Balances />],
          ["power", <h3>電力収支</h3>, <PowerConsumption />],
          ["operation", <h3>設備稼働</h3>, <RecipeOperationRatio />],
          ["graph", <h3>生産フロー</h3>, <GraphArea />],
          /* oxlint-enable react/jsx-key */
        ]}
        defaultValue="profits"
      />
    </>
  );
};
