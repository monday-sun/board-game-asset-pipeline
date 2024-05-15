import * as Papa from 'papaparse';
import { Observable, map, tap } from 'rxjs';
import { Card, Cards, CardsFactory } from '..';
import { DeckConfig } from '../../config';
import { File } from '../../file/file';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';

type RawResults = {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate?: string;
} & any;

class CSVCards implements Cards {
  cards$: Observable<Card[]>;
  constructor(csv: FileContent) {
    this.cards$ = csv.content$.pipe(
      map(({ content }) =>
        Papa.parse<RawResults>(content, {
          header: true,
        }),
      ),
      map((results) => {
        for (const error of results.errors) {
          console.warn(`${error.message} at ${error.row}`);
        }
        return results.data;
      }),
      map((results) =>
        results.map(({ name, count, frontTemplate, ...data }) => {
          let backTemplate = undefined;
          if (data.backTemplate) {
            backTemplate = data.backTemplate;
            delete data.backTemplate;
          }
          return <Card>{
            name,
            count: typeof count === 'string' ? parseInt(count) || 0 : count,
            frontTemplate,
            backTemplate,
            data,
          };
        }),
      ),
      tap(() => console.log('Loaded cards from csv')),
    );
  }
}

export const factory: CardsFactory = (
  args: Arguements,
  deckConfig: DeckConfig,
): Cards => {
  return new CSVCards(
    FileContent.factory(args, File.factory(args, deckConfig.list)),
  );
};
