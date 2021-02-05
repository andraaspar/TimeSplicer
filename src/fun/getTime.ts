import { getTimeField } from "../model/timeField";
import { getFps } from "./getFps";

export function getTime() {
  const isDuration = true;
  return currentFormatToTime(getTimeField().text, getFps(), isDuration);
}
