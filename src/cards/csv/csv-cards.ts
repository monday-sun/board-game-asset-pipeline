import * as Papa from 'papaparse';
import { Observable, from, switchMap } from 'rxjs';
import { Card, Cards } from '..';
import { FileContent } from '../../content-provider';
import { Arguements } from '../../types';

function parseCsv(content: string): Promise<Card[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Card>(content, {
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

class CSVCards implements Cards {
  cards$: Observable<Card[]>;

  constructor(csvProvider: FileContent) {
    this.cards$ = csvProvider
      .content()
      .pipe(switchMap((content) => from(parseCsv(content))));
  }
}

export function createCardsParser(
  args: Arguements,
  contentProvider: FileContent,
): Cards {
  return new CSVCards(contentProvider);
}
