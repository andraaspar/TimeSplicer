export class KeyFrame {
  public time: number;
  public value: number;

  public inInterpolationType: any;
  public outInterpolationType: any;
  public inSpatialTangent: any;
  public outSpatialTangent: any;
  public spatialContinuous: any;
  public spatialAutoBezier: any;
  public inTemporalEase: any;
  public outTemporalEase: any;
  public temporalContinuous: any;
  public temporalAutoBezier: any;
  public roving: any;
  public selected: any;

  constructor(public property: any, public index: number) {
    this.time = property.keyTime(index);
    this.value = property.keyValue(index);

    try {
      this.inInterpolationType = property.keyInInterpolationType(index);
      this.outInterpolationType = property.keyOutInterpolationType(index);
    } catch (e) {}
    try {
      this.inSpatialTangent = property.keyInSpatialTangent(index);
      this.outSpatialTangent = property.keyOutSpatialTangent(index);
      this.spatialContinuous = property.keySpatialContinuous(index);
      this.spatialAutoBezier = property.keySpatialAutoBezier(index);
    } catch (e) {}
    try {
      this.inTemporalEase = property.keyInTemporalEase(index);
      this.outTemporalEase = property.keyOutTemporalEase(index);
      this.temporalContinuous = property.keyTemporalContinuous(index);
      this.temporalAutoBezier = property.keyTemporalAutoBezier(index);
    } catch (e) {}
    try {
      this.roving = property.keyRoving(index);
    } catch (e) {}
    this.selected = property.keySelected(index);
  }

  set() {
    try {
      this.index = this.property.addKey(this.time);
    } catch (e) {
      alert(
        "Probably you've tried to delete a time remap's keyframe which switched time remapping off?\nPlease undo.",
        "Operation failed."
      );
      throw e;
    }

    this.property.setValueAtKey(this.index, this.value);
    if (this.inSpatialTangent) {
      this.property.setSpatialTangentsAtKey(
        this.index,
        this.inSpatialTangent,
        this.outSpatialTangent
      );
      this.property.setSpatialContinuousAtKey(
        this.index,
        this.spatialContinuous
      );
      this.property.setSpatialAutoBezierAtKey(
        this.index,
        this.spatialAutoBezier
      );
    }
    if (this.inTemporalEase) {
      this.property.setTemporalEaseAtKey(
        this.index,
        this.inTemporalEase,
        this.outTemporalEase
      );
      this.property.setTemporalContinuousAtKey(
        this.index,
        this.temporalContinuous
      );
      this.property.setTemporalAutoBezierAtKey(
        this.index,
        this.temporalAutoBezier
      );
    }
    if (this.inInterpolationType) {
      this.property.setInterpolationTypeAtKey(
        this.index,
        this.inInterpolationType,
        this.outInterpolationType
      );
    }
    if (this.roving) {
      this.property.setRovingAtKey(this.index, this.roving);
    }
    this.property.setSelectedAtKey(this.index, this.selected);
  }

  remove() {
    this.property.removeKey(this.index);
  }
}
