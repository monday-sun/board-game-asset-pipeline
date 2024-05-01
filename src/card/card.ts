import { CardInfo, LayoutRenderer } from '../types';

export class Card {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate: string;
  data: Record<string, string>;

  constructor(
    cardInfo: CardInfo,
    private layoutRenderer: LayoutRenderer,
  ) {
    this.name = cardInfo.name;
    this.count = cardInfo.count;
    this.frontTemplate = cardInfo.frontTemplate;
    this.backTemplate = cardInfo.backTemplate;

    // Store all unknown values
    this.data = cardInfo;
  }

  static from(cardInfo: CardInfo, layoutRenderer: LayoutRenderer) {
    return new Card(cardInfo, layoutRenderer);
  }

  async toHtml() {
    const frontHtml = await this.getFrontHtml();
    const backHtml = await this.getBackHtml();
    return { frontHtml, backHtml };
  }

  private getFrontHtml(): Promise<string> {
    return this.layoutRenderer.toHTML(this.frontTemplate, this.data);
  }

  private getBackHtml(): Promise<string> {
    return this.layoutRenderer.toHTML(this.backTemplate, this.data);
  }
}
