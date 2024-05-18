import path from 'path';
import { cwd } from 'process';
import { Observable, from, map } from 'rxjs';
import { Deck } from '../config';
import { Arguments } from '../types';

export type Card = {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate: string;
  [key: string]: string; // For unknown values
};

export type CardsFactory = (
  args: Arguments,
  deckConfig: Deck,
) => Observable<Card[]>;

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
    _: Arguments,
    deck: Deck,
  ): Observable<CardsFactory> => {
    const type = deck.cardsParser;
    const importPath =
      type in parserTypes
        ? parserTypes[type as keyof ParserTypes]
        : path.join(cwd(), type);

    console.log('Loading cards with', importPath);
    return from(import(importPath)).pipe(map(({ factory }) => factory));
  };
}
