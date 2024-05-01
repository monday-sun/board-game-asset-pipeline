import path from 'path';

function dashifyCardName(cardName: string): string {
  return cardName.replace(/ /g, '-').toLowerCase();
}
export function createImageFileName(
  outputPath: string,
  cardName: string,
  format: string = 'png',
  cardNumber: number = -1,
  suffix?: string,
): string {
  let cardNumberSuffix = '';
  if (cardNumber >= 1) {
    cardNumberSuffix = `-${cardNumber}`;
  }
  if (suffix) {
    cardNumberSuffix = `-${suffix}${cardNumberSuffix}`;
  }
  return path.join(
    outputPath,
    `${dashifyCardName(cardName)}${cardNumberSuffix}.${format}`,
  );
}
