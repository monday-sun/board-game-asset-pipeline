import * as Papa from 'papaparse';
import { Observable, map } from 'rxjs';
import { Card, Cards } from '..';
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
        if (!results.data) {
          throw new Error('Unable to parse CSV');
        }
        return results.data;
      }),
    );
  }
}

export function create(args: Arguements, fileContent: FileContent): Cards {
  return new PapaParseCards(fileContent);
}
