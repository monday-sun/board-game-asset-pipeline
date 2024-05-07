import path from 'path';
import { ImageFileInfo } from '../../types';

function dashifyCardName(cardName: string): string {
  return cardName.replace(/ /g, '-').toLowerCase();
}

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
