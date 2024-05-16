import { Observable, map } from 'rxjs';
import * as yaml from 'yaml';
import { Card, Cards, CardsFactory } from '..';
import { File } from '../../file/file';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';
import { Deck } from '../../config';

class YamlCards implements Cards {
  cards$: Observable<Card[]>;

  constructor(yamlContent$: FileContent) {
    this.cards$ = yamlContent$.pipe(
      map(({ content }) => yaml.parse(content)),
      map((results) => results as { cards: Card[] }),
      map(({ cards }) => cards),
    );
  }
}

export const factory: CardsFactory = (
  args: Arguements,
  deck: Deck,
): Cards => {
  return new YamlCards(
    FileContent.factory(args, File.factory(args, deck.list)),
  );
};
