import { CardsParser } from '../types';

const parserTypes = { ['csv']: './csv/cards-parser' };

export const findCardsParser = (
  type: keyof typeof parserTypes | string,
): Promise<() => CardsParser> => {
  return (
    type in parserTypes
      ? import(parserTypes[type as keyof typeof parserTypes])
      : import(type)
  ).then(({ createCardsParser }) => createCardsParser);
};
