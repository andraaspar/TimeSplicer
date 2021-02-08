import { getActiveComp } from "./getActiveComp";
import { getFps } from "./getFps";
import { getSelectedLayers } from "./getSelectedLayers";
import { reportError } from "./reportError";

export function timeRemap() {
  const activeComp = getActiveComp();

  try {
    const selectedLayers = getSelectedLayers(activeComp);

    app.beginUndoGroup(`Time Remap Toggled`);

    for (const selectedLayer of selectedLayers) {
      if (
        selectedLayer instanceof AVLayer &&
        selectedLayer.canSetTimeRemapEnabled
      ) {
        selectedLayer.timeRemapEnabled = !selectedLayer.timeRemapEnabled;
        if (
          selectedLayer.timeRemapEnabled &&
          selectedLayer.source instanceof CompItem
        ) {
          const timeRemap = selectedLayer.property("Time Remap");
          const isDuration = true;
          const time =
            timeRemap.keyTime(timeRemap.numKeys) -
            currentFormatToTime("1", getFps(), isDuration);
          timeRemap.addKey(time);
          timeRemap.removeKey(timeRemap.numKeys);
        }
      }
    }

    app.endUndoGroup();
  } catch (e) {
    reportError(e, `[qo7ur9] An error occurred. Please undo.`);
  }
}
