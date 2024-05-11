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
  config: string;
  cardList: string;
  outputDir: string;
  cards: string;
  layout: string;
  output: string;
  watch: boolean;
  test: boolean;
};
