import type { ReactNode } from "react";
import { Tabs } from "@base-ui/react/tabs";

import styles from "./styles.module.scss";

type Props<T extends string> = { rootClass?: string } & (
  | { withoutPanel?: false; tabs: [T, ReactNode, ReactNode][] }
  | { withoutPanel: true; tabs: [T, ReactNode][] }
) &
  (
    | { defaultValue: NoInfer<T> }
    | { value: NoInfer<T>; onValueChange: (arg: NoInfer<T>) => void }
  );

export const TabsPanel = <T extends string>(props: Props<T>): ReactNode => {
  const rootProps =
    "defaultValue" in props
      ? { defaultValue: props.defaultValue }
      : { value: props.value, onValueChange: props.onValueChange };

  return (
    <Tabs.Root {...rootProps} className={props.rootClass}>
      <Tabs.List className={styles.list}>
        {props.tabs.map(([value, head]) => (
          <Tabs.Tab key={value} value={value} className={styles.tab}>
            {head}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
      {!props.withoutPanel && (
        <div>
          {props.tabs.map(([value, , panel]) => (
            <Tabs.Panel key={value} value={value}>
              {panel}
            </Tabs.Panel>
          ))}
        </div>
      )}
    </Tabs.Root>
  );
};
