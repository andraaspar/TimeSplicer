import { KeyFrame } from "../KeyFrame";
import { reportError } from "./reportError";

export function addTimeToProperty(
  property: any,
  addAt: number,
  timeToAdd: number
) {
  try {
    const dummyKeyFrameTime = -666; // Prevents time remap from switching off
    const dummyKeyIndex =
      property.name === "Time Remap" && property.numKeys
        ? property.addKey(dummyKeyFrameTime)
        : -1;
    let keyFrames: KeyFrame[] = [];
    for (let i = 1; i <= property.numKeys; i++) {
      if (i === dummyKeyIndex) continue;
      const keyFrame = new KeyFrame(property, i);
      keyFrames.push(keyFrame);
    }
    for (let i = keyFrames.length - 1; i >= 0; i--) {
      keyFrames[i].remove();
    }
    for (const keyFrame of keyFrames) {
      if (timeToAdd >= 0) {
        if (keyFrame.time >= addAt) {
          keyFrame.time += timeToAdd;
        }
        keyFrame.set();
      } else {
        const deleteFrom = addAt;
        const timeToDelete = Math.abs(timeToAdd);
        const isToBeKept = keyFrame.time < deleteFrom;
        const isToBeMoved = keyFrame.time >= deleteFrom + timeToDelete;
        if (isToBeKept || isToBeMoved) {
          if (isToBeMoved) {
            keyFrame.time -= timeToDelete;
          }
          keyFrame.set();
        }
      }
    }
    if (dummyKeyIndex >= 0) {
      property.removeKey(property.nearestKeyIndex(dummyKeyFrameTime));
    }
  } catch (e) {
    reportError(e, `[qnys4j] Property could not be moved: ${property.name}`);
  }
}
