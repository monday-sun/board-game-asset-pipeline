import * as Papa from 'papaparse';
import { Observable, map } from 'rxjs';
import { Card, CardsFactory } from '..';
import { FileContent } from '../../file/file-content';
import { Arguments } from '../../types';

export const factory: CardsFactory = (
  args: Arguments,
  cardList$: FileContent,
): Observable<Card[]> => {
  return cardList$.pipe(
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
