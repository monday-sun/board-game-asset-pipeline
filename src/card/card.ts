import { convertToStaticHtml } from './react-to-html';

type CardInfo = {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate: string;
  [key: string]: string;  // For unknown values
};

export class Card {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate: string;
  unknownValues: Record<string, string>;

  constructor(cardInfo: CardInfo) {
    this.name = cardInfo.name;
    this.count = cardInfo.count;
    this.frontTemplate = cardInfo.frontTemplate;
    this.backTemplate = cardInfo.backTemplate;

    // Store all unknown values
    this.unknownValues = Object.keys(cardInfo)
      .filter(key => !['name', 'count', 'frontTemplate', 'backTemplate'].includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: cardInfo[key] }), {});
  }

  static from(cardInfo: CardInfo) {
    return new Card(cardInfo);
  }

  async toHtml() {
    const frontHtml = await convertToStaticHtml(this.frontTemplate, this.unknownValues);
    const backHtml = await convertToStaticHtml(this.backTemplate, this.unknownValues);
    return [frontHtml, backHtml];
  }
}