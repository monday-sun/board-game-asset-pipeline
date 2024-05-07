import { Observable } from 'rxjs';
import { FileContent } from '../file/file-content';
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

export type CardsFactory = (
  args: Arguements,
  contentProvider: FileContent,
) => Cards;

export namespace Cards {
  type ParserTypes = {
    csv: string;
    papaparse: string;
  };

  const parserTypes: ParserTypes = {
    csv: './papa-parse/papa-parse-cards', // Default csv to papaParse
    papaparse: './papa-parse/papa-parse-cards',
  };

  export const findFactory = (
    type: keyof ParserTypes | string,
  ): Promise<CardsFactory> => {
    return (
      type in parserTypes
        ? import(parserTypes[type as keyof ParserTypes])
        : import(type)
    ).then(({ factory }) => factory);
  };
}
