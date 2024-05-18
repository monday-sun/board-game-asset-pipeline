import * as Papa from 'papaparse';
import { Observable, map } from 'rxjs';
import { Card, CardsFactory } from '..';
import { Deck } from '../../decks';
import { File } from '../../file/file';
import { FileContent } from '../../file/file-content';
import { Arguments } from '../../types';

export const factory: CardsFactory = (
  args: Arguments,
  deck: Deck,
): Observable<Card[]> => {
  const cardsFile = File.factory(args, deck.list);
  const cardList = FileContent.factory(args, cardsFile);
  return cardList.pipe(
    map(({ content }) =>
      Papa.parse<Card>(content, {
        header: true,
      }),
    ),
    map((results) => {
      for (const error of results.errors) {
        console.warn(`${error.message} at ${error.row}`);
      }
      if (!results.data || results.data.length === 0) {
        throw new Error('No cards parsed from CSV file.');
      }
      return results.data;
    }),
  );
};
