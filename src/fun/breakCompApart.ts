import { getActiveComp } from "./getActiveComp";
import { getSelectedLayers } from "./getSelectedLayers";
import { reportError } from "./reportError";

export function breakCompApart() {
  const activeComp = getActiveComp();

  const selectedLayers = getSelectedLayers(activeComp);
  selectedLayers.sort((a: any, b: any) => a.index - b.index);

  app.beginUndoGroup("Composition Broken Apart");

  try {
    var aLayer;
    var aLayerComp;
    var aSubLayer;
    var aSubLayerMoved;
    for (var i = 0; i < selectedLayers.length; i++) {
      aLayer = selectedLayers[i];
      if (!(aLayer instanceof AVLayer)) continue;

      aLayerComp = aLayer.source;
      if (!(aLayerComp instanceof CompItem)) continue;

      for (var j = aLayerComp.numLayers; j > 0; j--) {
        aSubLayer = aLayerComp.layer(j);
        aSubLayer.copyToComp(activeComp);

        aSubLayerMoved = activeComp.layer(aLayer.index - 1);
        aSubLayerMoved.moveAfter(aLayer);
        aSubLayerMoved.startTime += aLayer.startTime;
      }

      aLayer.remove();
    }
  } catch (e) {
    reportError(e, `[qnysqo] There was an error. Please undo.`);
  }

  app.endUndoGroup();
}
