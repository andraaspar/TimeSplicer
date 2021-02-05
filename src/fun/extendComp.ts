import { getActiveComp } from "./getActiveComp";
import { getTime } from "./getTime";

export function extendComp() {
  getActiveComp().duration += getTime();
}
