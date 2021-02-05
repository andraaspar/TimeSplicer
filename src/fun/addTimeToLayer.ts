import { addTimeToProperties } from "./addTimeToProperties";

export function addTimeToLayer(layer: any, addAt: number, timeToAdd: number) {
  if (layer.inPoint >= addAt) {
    // Not layer.startTime because we usually have parts selected for a reason
    layer.startTime += timeToAdd;
  } else {
    addTimeToProperties(layer, addAt, timeToAdd);

    if (timeToAdd >= 0) {
      // Must copy values because outPoint can get corrupted when inPoint is set
      let inPoint = layer.inPoint;
      let outPoint = layer.outPoint;
      if (inPoint >= addAt) {
        inPoint += timeToAdd;
      }
      if (outPoint >= addAt) {
        outPoint += timeToAdd;
      }
      layer.inPoint = inPoint;
      layer.outPoint = outPoint;
    } else {
      const deleteFrom = addAt;
      const timeToDelete = Math.abs(timeToAdd);
      if (layer.inPoint >= deleteFrom) {
        layer.inPoint = deleteFrom;
      }

      if (layer.outPoint >= deleteFrom + timeToDelete) {
        layer.outPoint = layer.outPoint - timeToDelete;
      } else if (layer.outPoint >= deleteFrom) {
        layer.outPoint = deleteFrom;
      }
    }
  }
}
