import { addTime } from "./fun/addTime";
import { breakCompApart } from "./fun/breakCompApart";
import { extendComp } from "./fun/extendComp";
import { fitComp } from "./fun/fitComp";
import { getTime } from "./fun/getTime";
import { groupIntoComp } from "./fun/groupIntoComp";
import { onTimeFieldChanged } from "./fun/onTimeFieldChanged";
import { setTimeField } from "./model/timeField";

const window = new Window("palette", "Time splicer", undefined, {
  // resizeable: true,
});
window.orientation = "row";
window.margins = 1;
window.spacing = 1;

const timeField = window.add("edittext");
timeField.minimumSize = [50, 20];
timeField.onChange = onTimeFieldChanged;
setTimeField(timeField);

const addTimeButton = window.add("button", undefined, "Add time");
addTimeButton.onClick = () => {
  addTime(getTime());
};
window.defaultElement = addTimeButton;

const extendCompButton = window.add("button", undefined, "Extend");
extendCompButton.onClick = extendComp;

const deleteTimeButton = window.add("button", undefined, "Delete time");
deleteTimeButton.onClick = () => {
  addTime(-getTime());
};

const fitCompButton = window.add("button", undefined, "Fit composition");
fitCompButton.onClick = fitComp;

const groupIntoCompButton = window.add("button", undefined, "Group layers");
groupIntoCompButton.onClick = groupIntoComp;

const breakCompApartButton = window.add(
  "button",
  undefined,
  "Break composition apart"
);
breakCompApartButton.onClick = breakCompApart;

window.show();
