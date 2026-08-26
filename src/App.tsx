import type { FC, PropsWithChildren } from "react";
import { useAtomValue } from "jotai";

import { Dialog } from "@base-ui/react/dialog";

import { areaAtom, statusAtom } from "./lib/store";

import { Header } from "./layouts/Header";
import { Plan } from "./layouts/Plan";
import { Translate } from "./layouts/Translate";
import { Result } from "./layouts/Result";

import { FaGears } from "react-icons/fa6";
import styles from "./App.module.scss";

const Overlay = () => {
  const { run_ids } = useAtomValue(statusAtom);

  return (
    run_ids.length !== 0 && (
      <Dialog.Root open={true}>
        <Dialog.Portal className={styles.overlay}>
          <Dialog.Backdrop className={styles.backdrop} />
          <Dialog.Popup className={styles.popup}>
            <FaGears />
            PROCESSING
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    )
  );
};

const Main: FC<PropsWithChildren> = ({ children }) => {
  const area = useAtomValue(areaAtom);

  return (
    <main className={styles.main} data-area={area}>
      {children}
    </main>
  );
};

function App() {
  return (
    <>
      <Header />
      <Main>
        <div className={styles.plan_panel}>
          <Plan />
        </div>
        <div className={styles.translate_panel}>
          <Translate />
        </div>
        <div className={styles.result_panel}>
          <Result />
        </div>
        <Overlay />
      </Main>
    </>
  );
}

export default App;
