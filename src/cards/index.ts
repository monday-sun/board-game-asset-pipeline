import path from 'path';
import { cwd } from 'process';
import { Observable } from 'rxjs';
import { DeckConfig } from '../config';
import { Arguements } from '../types';

export type Card = {
  name: string;
  count: number;
  frontTemplate: string;
  backTemplate?: string;
  data: any;
};

export interface Cards {
  cards$: Observable<Card[]>;
}

export type CardsFactory = (args: Arguements, deckConfig: DeckConfig) => Cards;

export namespace Cards {
  type ParserTypes = {
    csv: string;
    yaml: string;
  };

  const parserTypes: ParserTypes = {
    csv: './csv/papa-parse-cards',
    yaml: './yaml/yaml-cards',
  };

  export const findFactory = (
    _: Arguements,
    deckConfig: DeckConfig,
  ): Promise<CardsFactory> => {
    const type = deckConfig.cardsParser;
    const importPath =
      type in parserTypes
        ? parserTypes[type as keyof ParserTypes]
        : path.join(cwd(), type);

    console.log('Loading cards with', importPath);
    return import(importPath).then(({ factory }) => factory);
  };
}
