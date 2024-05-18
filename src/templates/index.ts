import { Observable, from, map } from 'rxjs';
import { Card } from '../cards';
import { Deck } from '../config';
import { FileFactory, Paths } from '../file/file';
import { Arguments } from '../types';

export type NeedsLayout = {
  templatePaths: Paths;
  card: Card;
};

export type TemplatesFactory = (
  args: Arguments,
  deck: Deck,
  cards$: Observable<Card[]>,
  fileFactory: FileFactory,
) => Observable<NeedsLayout>;

export namespace Templates {
  export const findFactory = (
    args: Arguments,
    deck: Deck,
  ): Observable<TemplatesFactory> => {
    //
    return from(import('./templates')).pipe(map(({ factory }) => factory));
  };
}
