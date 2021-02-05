import { reportError } from "./reportError";

export function getActiveComp() {
  const activeComp = app?.project?.activeItem;
  if (!(activeComp instanceof CompItem)) {
    reportError(null, "[qnys9l] The selected item is not a composition.");
    throw new Error("NoActiveComp");
  }
  return activeComp;
}
