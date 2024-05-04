import { Observable } from 'rxjs';

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
  cards$: Observable<CardInfo[]>;
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
