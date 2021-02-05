import { getActiveComp } from "./getActiveComp";
import { getSelectedLayers } from "./getSelectedLayers";
import { reportError } from "./reportError";

export function groupIntoComp() {
  var activeComp = getActiveComp();

  var selectedLayers = getSelectedLayers(activeComp);
  selectedLayers.sort((a: any, b: any) => a.index - b.index);

  app.beginUndoGroup("Layers Grouped into Composition");

  try {
    var aLayer;
    var minInPoint = Infinity;
    var maxOutPoint = -Infinity;
    var minIndexLayer = selectedLayers[0];
    for (var i = 0; i < selectedLayers.length; i++) {
      aLayer = selectedLayers[i];

      minInPoint = Math.min(aLayer.inPoint, minInPoint);
      maxOutPoint = Math.max(aLayer.outPoint, maxOutPoint);

      minIndexLayer =
        minIndexLayer.index < aLayer.index ? minIndexLayer : aLayer;
    }

    const groupComp = app.project.items.addComp(
      "Group",
      activeComp.width,
      activeComp.height,
      activeComp.pixelAspect,
      maxOutPoint - minInPoint,
      activeComp.frameRate
    );
    const groupCompLayer = activeComp.layers.add(groupComp);
    groupCompLayer.moveBefore(minIndexLayer);
    groupCompLayer.startTime = minInPoint;

    for (i = selectedLayers.length - 1; i >= 0; i--) {
      aLayer = selectedLayers[i];

      aLayer.startTime -= minInPoint;
      aLayer.copyToComp(groupComp);
      aLayer.remove();
    }
  } catch (e) {
    reportError(e, `[qnyspk] There was an error. Please undo.`);
  }

  app.endUndoGroup();
}
