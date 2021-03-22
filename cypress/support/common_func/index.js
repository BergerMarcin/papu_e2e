export const findFirstVisibleElementIndex = (elementsSelector) => {
  const elements = cy.$$(elementsSelector)
  let visibleIndex = 0
  while (!elements.eq(visibleIndex).is(':visible')) visibleIndex++
  return visibleIndex < elements.length ? visibleIndex : -1
}

// thanks to Konstantin Smolyanin answer @ https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
export const readBinaryStringFromArrayBuffer = (arrayBuffer, onSuccess, onFail) => {
  var reader = new FileReader();
  reader.onload = function (event) {
    onSuccess(event.target.result);
  };
  reader.onerror = function (event) {
    onFail(event.target.error);
  };
  reader.readAsBinaryString(new Blob([ arrayBuffer ],
    { type: 'application/octet-stream' }));
}