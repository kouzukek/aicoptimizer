import { solve } from "../../lib/solve";
import { build_error_result } from "../../lib/store";
import { SolverRequestSchema, type SolverResponse } from "../../lib/types";

const listener = async ({ data }: MessageEvent) => {
  const resp = (arg: SolverResponse) => {
    self.postMessage(arg);
  };

  try {
    const req = SolverRequestSchema.parse(data);
    const result = await solve(req);
    resp(result);
  } catch (e) {
    console.log({ data });
    console.error(e);
    resp(build_error_result(e));
  } finally {
    self.removeEventListener("message", listener);
  }
};
self.addEventListener("message", listener);

export default {};
