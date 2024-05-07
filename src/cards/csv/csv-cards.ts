import * as Papa from 'papaparse';
import { Observable, Subject, map } from 'rxjs';
import { Card, Cards } from '..';
import { FileContent } from '../../file-content';
import { Arguements } from '../../types';

class CSVCards implements Cards {
  cards$: Observable<Card[]>;

  private errorsSubject = new Subject<string>();
  errors$ = this.errorsSubject;

  constructor(csv: FileContent) {
    this.cards$ = csv.content$.pipe(map((content) => this.parseCsv(content)));
  }

  private parseCsv(content: string) {
    const results = Papa.parse<Card>(content, {
      header: true,
    });
    results.errors.forEach((error) => {
      this.errorsSubject.next(error.message);
    });
    return results.data;
  }
}

export function create(args: Arguements, contentProvider: FileContent): Cards {
  return new CSVCards(contentProvider);
}
