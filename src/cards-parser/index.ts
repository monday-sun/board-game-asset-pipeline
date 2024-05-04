import { ContentProvider } from '../content-provider';
import { Arguements, CardsParser } from '../types';

type ParserTypes = {
  csv: string;
};

const parserTypes: ParserTypes = { csv: './csv/csv-cards-parser' };

export const findCardsParser = (
  type: keyof typeof parserTypes | string,
): Promise<
  (args: Arguements, contentProvider: ContentProvider) => CardsParser
> => {
  return (
    type in parserTypes
      ? import(parserTypes[type as keyof typeof parserTypes])
      : import(type)
  ).then(({ createCardsParser }) => createCardsParser);
};
