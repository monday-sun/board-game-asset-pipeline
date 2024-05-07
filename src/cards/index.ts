import { Observable } from 'rxjs';
import { FileContent } from '../file-content';
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

export namespace Cards {
  type ParserTypes = {
    csv: string;
  };

  const parserTypes: ParserTypes = { csv: './csv/csv-cards-parser' };

  export const findCardsParser = (
    type: keyof ParserTypes | string,
  ): Promise<(args: Arguements, contentProvider: FileContent) => Cards> => {
    return (
      type in parserTypes
        ? import(parserTypes[type as keyof typeof parserTypes])
        : import(type)
    ).then(({ createCardsParser }) => createCardsParser);
  };
}
