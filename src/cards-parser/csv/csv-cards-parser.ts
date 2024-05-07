import * as Papa from 'papaparse';
import { Observable, from, switchMap } from 'rxjs';
import { Cards } from '..';
import { ContentProvider } from '../../content-provider';
import { Arguements, CardInfo } from '../../types';

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

class CSVCardsParser implements Cards {
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
): Cards {
  return new CSVCardsParser(contentProvider);
}
