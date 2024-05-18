import { Observable, map } from 'rxjs';
import * as yaml from 'yaml';
import { Card, CardsFactory } from '..';
import { Deck } from '../../config';
import { File } from '../../file/file';
import { FileContent } from '../../file/file-content';
import { Arguments } from '../../types';

export const factory: CardsFactory = (
  args: Arguments,
  deck: Deck,
): Observable<Card[]> => {
  const cardList = File.factory(args, deck.list);
  const cardListContent = FileContent.factory(args, cardList);
  return cardListContent.pipe(
    map(({ content }) => yaml.parse(content)),
    map((results) => results as { cards: Card[] }),
    map(({ cards }) => cards),
  );
};
