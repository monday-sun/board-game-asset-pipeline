import nodeHtmlToImage from 'node-html-to-image';
import { CardInfo, ImageRenderer, LayoutRenderer } from '../../types';
class NodeIndividualCardImageRenderer implements ImageRenderer {
  constructor() {}

  async toImages(
    cardInfos: CardInfo[],
    layoutRenderer: LayoutRenderer,
  ): Promise<string[]> {
    return Promise.resolve(['todo']);
  }

  private toImage(html: string, output: string): Promise<string> {
    return nodeHtmlToImage({ output, html }).then(() => output);
  }
}

export function createImageRenderer(): ImageRenderer {
  return new NodeIndividualCardImageRenderer();
}
