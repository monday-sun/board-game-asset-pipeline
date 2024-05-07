import { Card } from './cards';
import { LayoutRenderer } from './layout-renderer';

export type ImageFileInfo = {
  outputPath: string;
  cardName: string;
  suffix?: string;
  cardNumber?: number;
  format?: string;
};

export interface ImageRenderer {
  toImages(
    cardInfos: Card[],
    layoutRenderer: LayoutRenderer,
  ): Promise<string[]>;
}

export type Arguements = {
  [x: string]: unknown;
  cardList: string;
  outputDir: string;
  cardsParser: string;
  layoutRenderer: string;
  imageRenderer: string;
  debugHtml: boolean;
  watch: boolean;
};
