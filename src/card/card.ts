import { CardInfo } from '../card-info.types';
import { convertToStaticHtml } from '../react-to-html/react-to-html';

export class Card {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate: string;
  data: Record<string, string>;

  constructor(cardInfo: CardInfo) {
    this.name = cardInfo.name;
    this.count = cardInfo.count;
    this.frontTemplate = cardInfo.frontTemplate;
    this.backTemplate = cardInfo.backTemplate;

    // Store all unknown values
    this.data = cardInfo;
  }

  static from(cardInfo: CardInfo) {
    return new Card(cardInfo);
  }

  async toHtml() {
    const frontHtml = await convertToStaticHtml(this.frontTemplate, this.data);
    const backHtml = await convertToStaticHtml(this.backTemplate, this.data);
    return { frontHtml, backHtml };
  }
}
