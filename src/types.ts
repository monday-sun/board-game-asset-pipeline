import { Card } from './cards';
import { Layout } from './layout';

export type ImageFileInfo = {
  outputPath: string;
  cardName: string;
  suffix?: string;
  cardNumber?: number;
  format?: string;
};

export interface ImageRenderer {
  toImages(cardInfos: Card[], layoutRenderer: Layout): Promise<string[]>;
}

export type Arguements = {
  [x: string]: unknown;
  cardList: string;
  outputDir: string;
  cardsParser: string;
  layout: string;
  imageRenderer: string;
  debugHtml: boolean;
  watch: boolean;
};
