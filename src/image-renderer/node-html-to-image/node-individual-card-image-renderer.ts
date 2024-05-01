import nodeHtmlToImage from 'node-html-to-image';
import { CardInfo, ImageRenderer, LayoutRenderer } from '../../types';
import { createImageFileName } from '../../util/image-file-name';

function cardsToImages(
  cardInfos: CardInfo[],
  layoutRenderer: LayoutRenderer,
): Promise<string>[] {
  return cardInfos
    .map((cardInfo) => cardCopiesToImages(cardInfo, layoutRenderer))
    .flat();
}

function cardCopiesToImages(
  cardInfo: CardInfo,
  layoutRenderer: LayoutRenderer,
): Promise<string>[] {
  const count = parseInt(cardInfo.count, 10) || 0;
  if (count === 0) {
    return [];
  }

  if (count === 1) {
    // Skip the copy number if there is only one card
    return cardToImages(cardInfo, layoutRenderer);
  }

  return Array.from({ length: count }, (_, i) =>
    cardToImages(cardInfo, layoutRenderer, i + 1),
  ).flat();
}

function cardToImages(
  cardInfo: CardInfo,
  layoutRenderer: LayoutRenderer,
  copyNumber?: number,
): Promise<string>[] {
  return [
    sideToImage(cardInfo, layoutRenderer, 'front', copyNumber),
    sideToImage(cardInfo, layoutRenderer, 'back', copyNumber),
  ];
}

function sideToImage(
  cardInfo: CardInfo,
  layoutRenderer: LayoutRenderer,
  side: 'front' | 'back',
  copyNumber?: number,
): Promise<string> {
  const output = createImageFileName('', cardInfo.name, side, copyNumber);
  return layoutRenderer
    .toHTML(cardInfo[`${side}Template`], cardInfo)
    .then((html) => toImage(html, output));
}

function toImage(html: string, output: string): Promise<string> {
  return nodeHtmlToImage({ output, html }).then(() => {
    console.log('Rendered ', output);
    return output;
  });
}
class NodeIndividualCardImageRenderer implements ImageRenderer {
  constructor() {}

  async toImages(
    cardInfos: CardInfo[],
    layoutRenderer: LayoutRenderer,
  ): Promise<string[]> {
    return Promise.all(cardsToImages(cardInfos, layoutRenderer));
  }
}

export function createImageRenderer(): ImageRenderer {
  return new NodeIndividualCardImageRenderer();
}
