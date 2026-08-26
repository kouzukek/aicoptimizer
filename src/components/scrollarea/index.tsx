import type { FC, PropsWithChildren } from "react";
import { ScrollArea as SA } from "@base-ui/react/scroll-area";

import styles from "./styles.module.scss";

export const ScrollArea: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SA.Root className={styles.root}>
      <SA.Viewport className={styles.viewport}>
        <SA.Content className={styles.content}>{children}</SA.Content>
      </SA.Viewport>
      <SA.Scrollbar className={styles.scrollbar}>
        <SA.Thumb className={styles.thumb} />
      </SA.Scrollbar>
    </SA.Root>
  );
};
