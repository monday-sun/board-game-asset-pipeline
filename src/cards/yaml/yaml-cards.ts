import { Observable, map } from 'rxjs';
import * as yaml from 'yaml';
import { Card, CardsFactory } from '..';
import { FileContent } from '../../file/file-content';
import { Arguments } from '../../types';

export const factory: CardsFactory = (
  args: Arguments,
  cardList$: FileContent,
): Observable<Card[]> => {
  return cardList$.pipe(
    map(({ content }) => yaml.parse(content)),
    map(({ cards }) => cards),
    map((cards) =>
      Object.keys(cards).map((key) => ({ name: key, ...cards[key] })),
    ),
  );
};
