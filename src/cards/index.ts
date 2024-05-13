import path from 'path';
import { cwd } from 'process';
import { Observable } from 'rxjs';
import { DeckConfig } from '../config';
import { Arguements } from '../types';

export type Card = {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate: string;
  [key: string]: string; // For unknown values
};

export interface Cards {
  cards$: Observable<Card[]>;
}

export type CardsFactory = (args: Arguements, deckConfig: DeckConfig) => Cards;

export namespace Cards {
  type ParserTypes = {
    csv: string;
    papaparse: string;
    yaml: string;
  };

  const parserTypes: ParserTypes = {
    csv: './papa-parse/papa-parse-cards', // Default csv to papaParse
    papaparse: './papa-parse/papa-parse-cards',
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
