import path from 'path';
import { cwd } from 'process';
import { Observable, from, map, mergeMap, shareReplay, tap } from 'rxjs';
import { Deck } from '../decks';
import { File } from '../file/file';
import { FileContent } from '../file/file-content';
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
  content$: FileContent,
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

  export const pipeline = (
    args: Arguments,
    deck: Deck,
    endWatch$: Observable<boolean> | undefined,
  ) => {
    const file$ = File.factory(args, deck.list, endWatch$);
    const fileContent$ = FileContent.factory(args, file$);
    return Cards.findFactory(args, deck).pipe(
      mergeMap((cardsFactory) => cardsFactory(args, fileContent$)),
      tap(() => console.log('Loaded cards from', deck.list)),
      shareReplay(),
    );
  };
}
