import { addTimeToProperty } from "./addTimeToProperty";

export function addTimeToProperties(
  parent: any,
  addAt: number,
  timeToAdd: number
) {
  for (var i = 1; i <= parent.numProperties; i++) {
    var property = parent.property(i);
    if (property instanceof Property) {
      addTimeToProperty(property, addAt, timeToAdd);
    } else if (property instanceof PropertyGroup) {
      addTimeToProperties(property, addAt, timeToAdd);
    }
  }
}
