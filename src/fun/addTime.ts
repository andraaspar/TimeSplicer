import { addTimeToLayer } from "./addTimeToLayer";
import { getActiveComp } from "./getActiveComp";
import { getSelectedLayers } from "./getSelectedLayers";
import { reportError } from "./reportError";

export function addTime(timeToAdd: number) {
  const activeComp = getActiveComp();

  app.beginUndoGroup(
    `Composition Time ${timeToAdd >= 0 ? "Added" : "Deleted"}`
  );

  try {
    const selectedLayers = getSelectedLayers(activeComp);
    const addAt = activeComp.time;
    for (const aLayer of selectedLayers) {
      addTimeToLayer(aLayer, addAt, timeToAdd);
    }

    if (selectedLayers.length == activeComp.numLayers) {
      activeComp.duration += timeToAdd;
    }
  } catch (e) {
    reportError(e, `[qnys8f] There was an error. Please undo.`);
  }

  app.endUndoGroup();
}
