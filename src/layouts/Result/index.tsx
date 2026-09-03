import { useAtomValue } from "jotai";

import { additionalRequirementsAtom, resultAtom } from "../../lib/store";
import { format } from "../../lib/utils";

import { Graph } from "../Graph";

import styles from "./styles.module.scss";
import { TabsPanel } from "../../components/tabs";

const Profits = () => {
  const result = useAtomValue(resultAtom);
  const requirements =
    useAtomValue(additionalRequirementsAtom)["balance"] ?? [];
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
            {result.items
              .filter(
                ({ id, profit, balance }) =>
                  profit >= 1e-6 ||
                  (balance >= 1e-6 && requirements.some(([rid]) => rid === id)),
              )
              .toSorted((a, b) => b.profit - a.profit)
              .map(({ id, name, balance, profit }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td data-type="volume">{format(balance, 1)}</td>
                  <td data-type="price">
                    {format(profit >= 1e-6 ? profit / balance : 0)}
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
                Σ{" "}
                {format(
                  result.items.reduce((acc, cur) => acc + cur.profit, 0),
                  1,
                )}
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
          {result.items
            .toSorted((a, b) => b.output - a.output)
            .filter(({ id }) => id !== "Power")
            .map(({ id, name, output, input, cost, balance }) => (
              <tr key={id}>
                <td>{name}</td>
                <td data-type="volume">{format(output, 1)}</td>
                <td data-type="volume">{format(input + cost, 1)}</td>
                <td data-type="volume">{format(balance, 1)}</td>
              </tr>
            ))}
        </tbody>
      )}
    </table>
  );
};

const PowerConsumption = () => {
  const result = useAtomValue(resultAtom);
  const succeed = result.status === "Optimal";

  const agg = succeed
    ? [
        ...result.recipes.reduce((acc, cur) => {
          const prev = acc.get(cur.machine.id) ?? {
            name: cur.machine.name,
            count: 0,
            ratio: 0,
            output: 0,
            input: 0,
          };

          const get = (key: "output" | "input" | "cost") =>
            cur[key].find(({ id }) => id === "Power")?.volume ?? 0;
          acc.set(cur.machine.id, {
            name: prev.name,
            count: prev.count + cur.count,
            ratio: prev.ratio + cur.count * cur.ratio,
            output: prev.output + get("output") * cur.count * cur.ratio,
            input:
              prev.input +
              get("input") * cur.count * cur.ratio +
              get("cost") * cur.count,
          });

          return acc;
        }, new Map<string, { name: string; count: number; ratio: number; output: number; input: number }>()),
      ]
    : undefined;

  const { output: totalOutput, input: totalInput } =
    agg?.reduce(
      ({ output, input }, cur) => ({
        output: output + cur[1].output,
        input: input + cur[1].input,
      }),
      { output: 0, input: 0 },
    ) ?? {};

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
      {agg && (
        <>
          <tbody>
            {agg
              .toSorted(
                (a, b) => b[1].output - b[1].input - (a[1].output - a[1].input),
              )
              .map(([id, { name, count, ratio, output, input }]) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td data-type="count">{format(count)}</td>
                  <td data-type="ratio">{format((ratio / count) * 100)}</td>
                  <td data-type="volume">{format(output)}</td>
                  <td data-type="volume">{format(input)}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3}></th>
              <th scope="col" data-type="volume">
                {format(totalOutput!)}
              </th>
              <th scope="col" data-type="volume">
                {format(totalInput!)}
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
          {result.recipes.map(
            ({ index, machine, input, output, cost, count, ratio }) => (
              <tr key={index}>
                <td>{machine.name}</td>
                <td>
                  <div className={styles.recipe_resources_stack}>
                    {input
                      .toSorted((a, b) => b.volume - a.volume)
                      .filter(({ id }) => id !== "Power")
                      .map(({ id, name, volume }) => (
                        <div key={`input-${id}`}>
                          <div>{name}</div>
                          <div data-type="volume">{format(volume, 0, 1)}</div>
                        </div>
                      ))}
                    {cost
                      .toSorted((a, b) => b.volume - a.volume)
                      .filter(({ id }) => id !== "Power")
                      .map(({ id, name, volume }) => (
                        <div key={`cost-${id}`}>
                          <div>{name}</div>
                          <div data-type="volume">{format(volume, 0, 1)}</div>
                        </div>
                      ))}
                  </div>
                </td>
                <td>
                  <div className={styles.recipe_resources_stack}>
                    {output
                      .toSorted((a, b) => b.volume - a.volume)
                      .map(({ id, name, volume }) => (
                        <div key={`output-${id}`}>
                          <div>{name}</div>
                          <div data-type="volume">{format(volume, 0, 1)}</div>
                        </div>
                      ))}
                  </div>
                </td>
                <td data-type="count">{format(count)}</td>
                <td data-type="ratio">{format(ratio * 100, 1)}</td>
              </tr>
            ),
          )}
        </tbody>
      )}
    </table>
  );
};

const GraphArea = () => {
  const result = useAtomValue(resultAtom);

  return (
    <div className={styles.grapharea}>
      <Graph
        recipes={
          result.status === "Optimal"
            ? result.recipes.map(({ index }) => index)
            : []
        }
      />
    </div>
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
