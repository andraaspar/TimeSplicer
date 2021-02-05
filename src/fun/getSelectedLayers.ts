export function getSelectedLayers(comp: any) {
  let selectedLayers = comp?.selectedLayers ?? [];
  if (selectedLayers.length == 0) {
    selectedLayers = [];
    for (var i = 1; i <= comp.numLayers; i++) {
      selectedLayers.push(comp.layer(i));
    }
  }
  return selectedLayers;
}
