import { Observable } from 'rxjs';
import { ContentProvider } from '../content-provider';
import { Arguements } from '../types';

export interface Cards {
  cards$: Observable<Cards.Info[]>;
}

export namespace Cards {
  export type Info = {
    name: string;
    count: string;
    frontTemplate: string;
    backTemplate: string;
    [key: string]: string; // For unknown values
  };

  type ParserTypes = {
    csv: string;
  };

  const parserTypes: ParserTypes = { csv: './csv/csv-cards-parser' };

  export const findCardsParser = (
    type: keyof ParserTypes | string,
  ): Promise<(args: Arguements, contentProvider: ContentProvider) => Cards> => {
    return (
      type in parserTypes
        ? import(parserTypes[type as keyof typeof parserTypes])
        : import(type)
    ).then(({ createCardsParser }) => createCardsParser);
  };
}
