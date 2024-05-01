import { CardInfo, ImageRenderer, LayoutRenderer } from '../../types';

class NodeSingleCardImageRenderer implements ImageRenderer {
  async toImages(
    cardInfos: CardInfo[],
    layoutRenderer: LayoutRenderer,
  ): Promise<string[]> {
    return Promise.all(
      cardInfos.map(async (cardInfo) => {
        const frontHtml = await layoutRenderer.toHTML(
          cardInfo.frontTemplate,
          cardInfo,
        );
        const backHtml = await layoutRenderer.toHTML(
          cardInfo.backTemplate,
          cardInfo,
        );

        return this.toImage(frontHtml, backHtml);
      }),
    );
  }

  private toImage(frontHtml: string, backHtml: string): string {
    // Render the front and back HTML to a single image
    return 'image';
  }
}

export function createImageRenderer(): ImageRenderer {
  return new NodeSingleCardImageRenderer();
}
