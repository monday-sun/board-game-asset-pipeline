import * as Papa from 'papaparse';
import { Observable, map, tap } from 'rxjs';
import { Card, Cards, CardsFactory } from '..';
import { DeckConfig } from '../../config';
import { File } from '../../file/file';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';

// https://www.papaparse.com/
class PapaParseCards implements Cards {
  cards$: Observable<Card[]>;

  constructor(csv: FileContent) {
    this.cards$ = csv.content$.pipe(
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
      tap(() => console.log('Loaded cards from csv')),
    );
  }
}

export const factory: CardsFactory = (
  args: Arguements,
  deckConfig: DeckConfig,
): Cards => {
  return new PapaParseCards(
    FileContent.factory(args, File.factory(args, deckConfig.list)),
  );
};
