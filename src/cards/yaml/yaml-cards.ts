import { Observable, map, tap } from 'rxjs';
import * as yaml from 'yaml';
import { Card, Cards, CardsFactory } from '..';
import { DeckConfig } from '../../config';
import { File } from '../../file/file';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';

class YamlCards implements Cards {
  cards$: Observable<Card[]>;

  constructor(yamlContent: FileContent) {
    this.cards$ = yamlContent.content$.pipe(
      map(({ content }) => yaml.parse(content)),
      map(
        (results) =>
          results as {
            cards: {
              [key: string]: {
                count: number | string;
                frontTemplate: string;
                backTemplate: string;
              } & any;
            };
          },
      ),
      map(({ cards }) => cards),
      map((cards) =>
        Object.keys(cards).map((name) => {
          console.log(name);
          const { count, frontTemplate, ...data } = cards[name];
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
      tap(() => console.log('Loaded cards from yaml')),
    );
  }
}

export const factory: CardsFactory = (
  args: Arguements,
  deckConfig: DeckConfig,
): Cards => {
  return new YamlCards(
    FileContent.factory(args, File.factory(args, deckConfig.list)),
  );
};
