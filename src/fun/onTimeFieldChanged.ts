import { getTimeField } from "../model/timeField";
import { getFps } from "./getFps";

export function onTimeFieldChanged() {
  const fps = getFps();
  const isDuration = true;
  const timeField = getTimeField();
  timeField.text = timeToCurrentFormat(
    currentFormatToTime(timeField.text, fps, isDuration),
    fps,
    isDuration
  );
}
