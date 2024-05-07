import * as Papa from 'papaparse';
import { Observable, from, switchMap } from 'rxjs';
import { Card, Cards } from '..';
import { FileContent } from '../../file-content';
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

  constructor(csv: FileContent) {
    this.cards$ = csv.content$.pipe(
      switchMap((content) => from(parseCsv(content))),
    );
  }
}

export function create(args: Arguements, contentProvider: FileContent): Cards {
  return new CSVCards(contentProvider);
}
