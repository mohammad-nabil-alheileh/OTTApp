// Streams often have several bitrates per resolution; the menu lists each
// height once, highest first.
export const toQualities = (heights: Array<number | undefined>): number[] =>
  [...new Set(heights.filter((h): h is number => !!h && h > 0))].sort((a, b) => b - a);
