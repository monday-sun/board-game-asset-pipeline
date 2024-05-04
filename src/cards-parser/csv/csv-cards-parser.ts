import * as Papa from 'papaparse';
import { Observable, from, switchMap } from 'rxjs';
import {
  Arguements,
  CardInfo,
  CardsParser,
  ContentProvider,
} from '../../types';

function parseCsv(content: string): Promise<CardInfo[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CardInfo>(content, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data);
        }
      },
    });
  });
}

class CSVCardsParser implements CardsParser {
  cards$: Observable<CardInfo[]>;

  constructor(csvProvider: ContentProvider) {
    this.cards$ = csvProvider
      .content()
      .pipe(switchMap((content) => from(parseCsv(content))));
  }
}

export function createCardsParser(
  args: Arguements,
  contentProvider: ContentProvider,
): CardsParser {
  return new CSVCardsParser(contentProvider);
}
