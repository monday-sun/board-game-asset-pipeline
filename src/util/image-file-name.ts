import path from 'path';

function dashifyCardName(cardName: string): string {
  return cardName.replace(/ /g, '-').toLowerCase();
}
type ImageFileInfo = {
  outputPath: string;
  cardName: string;
  suffix?: string;
  cardNumber?: number;
  format?: string;
};

export function createImageFileName({
  outputPath,
  cardName,
  suffix,
  cardNumber = -1,
  format = 'png',
}: ImageFileInfo): string {
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
