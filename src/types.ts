export type CardInfo = {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate: string;
  [key: string]: string; // For unknown values
};

export type ImageFileInfo = {
  outputPath: string;
  cardName: string;
  suffix?: string;
  cardNumber?: number;
  format?: string;
};

export interface CardsParser {
  parseCards(cardsDataPath: string): Promise<CardInfo[]>;
}

export interface LayoutRenderer {
  toHTML(templatePath: string, data: Record<string, string>): Promise<string>;
}

export interface ImageRenderer {
  toImages(
    cardInfos: CardInfo[],
    layoutRenderer: LayoutRenderer,
  ): Promise<string[]>;
}
