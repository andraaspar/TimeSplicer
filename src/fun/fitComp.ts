import { getActiveComp } from "./getActiveComp";
import { reportError } from "./reportError";

export function fitComp() {
  var activeComp = getActiveComp();
  if (!activeComp.numLayers) return;

  app.beginUndoGroup("Composition Fitted");

  try {
    var aLayer;
    var minInPoint = Infinity;
    var maxOutPoint = -Infinity;
    for (var i = 1; i <= activeComp.numLayers; i++) {
      aLayer = activeComp.layer(i);
      minInPoint = Math.min(aLayer.inPoint, minInPoint);
    }

    for (i = 1; i <= activeComp.numLayers; i++) {
      aLayer = activeComp.layer(i);
      aLayer.startTime -= minInPoint;
      maxOutPoint = Math.max(aLayer.outPoint, maxOutPoint);
    }

    activeComp.duration = maxOutPoint;
  } catch (e) {
    reportError(e, `[qnyspz] There was an error. Please undo.`);
  }

  app.endUndoGroup();
}
