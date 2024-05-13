import { Observable, map } from 'rxjs';
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
      map((results) => results as { cards: Card[] }),
      map(({ cards }) => cards),
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
