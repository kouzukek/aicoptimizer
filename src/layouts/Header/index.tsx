import { area_ids } from "../../lib/recipes";
import styles from "./styles.module.scss";

export const Header = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>Arknights; Endfield AIC Optimizer</h1>
    {area_ids.map((id) => (
      <div key={id} data-accent-layer={id} className={styles.accent} />
    ))}
  </header>
);
