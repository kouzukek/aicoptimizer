import { useAtomValue } from "jotai";

import { Dialog } from "@base-ui/react/dialog";

import { statusAtom } from "./lib/store";

import { Header } from "./layouts/Header";
import { Plan } from "./layouts/Plan";
import { Translate } from "./layouts/Translate";
import { Result } from "./layouts/Result";

import { FaGears, FaGithub } from "react-icons/fa6";
import styles from "./App.module.scss";

const CHANGELOG = [
  `v0.2.0 Append "Snowy Forest" mining spots. Append "Water Purifier" recipes.`,
  `v0.1.0 First Release`,
];

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

const Changelog = () => {
  return (
    <details className={styles.changelog}>
      <summary>
        CHANGELOG <span className={styles.latest_change}>{CHANGELOG[0]}</span>
      </summary>
      <ul>
        {CHANGELOG.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
    </details>
  );
};

function App() {
  const repo_url = "https://github.com/kouzukek/aicoptimizer";
  return (
    <>
      <Header />
      <Changelog />
      <main className={styles.main}>
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
      </main>
      <footer className={styles.footer}>
        <a href={repo_url}>
          <FaGithub /> {repo_url}
        </a>
      </footer>
    </>
  );
}

export default App;
