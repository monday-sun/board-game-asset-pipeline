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
  errors$: Observable<string>;
}

export namespace Cards {
  type ParserTypes = {
    csv: string;
    papaParse: string;
  };

  const parserTypes: ParserTypes = {
    csv: './papa-parse/papa-parse-cards', // Default csv to papaParse
    papaParse: './papa-parse/papa-parse-cards',
  };

  const findCardsParser = (
    type: keyof ParserTypes | string,
  ): Promise<(args: Arguements, contentProvider: FileContent) => Cards> => {
    return (
      type in parserTypes
        ? import(parserTypes[type as keyof typeof parserTypes])
        : import(type)
    ).then(({ create }) => create);
  };

  export function factory(args: Arguements): Promise<Cards> {
    return Promise.all([
      FileContent.factory(args, args.cardList),
      findCardsParser(args.cardsParser),
    ]).then(([content, parser]) => {
      return parser(args, content);
    });
  }
}
