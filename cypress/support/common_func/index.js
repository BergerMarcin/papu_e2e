export const findFirstVisibleElementIndex = (elementsSelector) => {
  const elements = cy.$$(elementsSelector)
  let visibleIndex = 0
  while (!elements.eq(visibleIndex).is(':visible')) visibleIndex++
  return visibleIndex < elements.length ? visibleIndex : -1
}