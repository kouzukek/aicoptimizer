import { useAtomValue, useSetAtom } from "jotai";

import {
  statusAtom,
  planAtom,
  resultAtom,
  build_error_result,
} from "../../lib/store";
import { SolverResponseSchema } from "../../lib/types";
import { format } from "../../lib/utils";

import Worker from "./worker?worker";

import styles from "./styles.module.scss";

const SolveButton = () => {
  const plan = useAtomValue(planAtom);
  const setStatus = useSetAtom(statusAtom);
  const setResult = useSetAtom(resultAtom);

  const onClickHandler = () => {
    const t0 = performance.now();
    const uuid = crypto.randomUUID();
    const remove_run_id = () => {
      setStatus((prev) => ({
        ...prev,
        run_ids: prev.run_ids.filter((id) => id !== uuid),
      }));
    };

    setStatus((prev) => ({ ...prev, run_ids: [...prev.run_ids, uuid] }));
    try {
      const worker = new Worker();

      const dispose = () => {
        worker.removeEventListener("message", onMessage);
        worker.removeEventListener("error", onError);
        remove_run_id();
        worker.terminate();
      };
      const onMessage = ({ data }: MessageEvent) => {
        try {
          const resp = SolverResponseSchema.parse(data);
          const t1 = performance.now();

          console.log(resp);
          console.log(`Solve time: ${format(t1 - t0)} ms`);

          setResult({ ...resp, duration: t1 - t0 });
        } catch (e) {
          setResult(build_error_result(e));
        } finally {
          dispose();
        }
      };
      const onError = (e: ErrorEvent) => {
        setResult(build_error_result(e.error ?? e.message ?? "Unknown error."));
        dispose();
      };

      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);

      worker.postMessage(plan);
    } catch (e) {
      setResult(build_error_result(e));
      remove_run_id();
    }
  };

  return (
    <button onClick={onClickHandler} className={styles.button}>
      EXECUTE
    </button>
  );
};

const StatusArea = () => {
  const result = useAtomValue(resultAtom);
  return (
    <div className={styles.status} data-status={result.status}>
      {result.status === "Optimal"
        ? "Succeeded"
        : result.status === "Unoptimized"
          ? result.message
          : result.status === "Error"
            ? result.message
            : result.status === "Initialized"
              ? "Initialized"
              : "Invalid status"}
      {result.duration !== undefined && ` in ${format(result.duration)} ms`}
    </div>
  );
};

export const Translate = () => {
  return (
    <>
      <h2>OPTIMIZE</h2>
      <SolveButton />
      <h3>ステータス</h3>
      <StatusArea />
    </>
  );
};
