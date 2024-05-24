import { Observable, from, map, mergeMap, shareReplay, tap } from 'rxjs';
import { Card } from '../cards';
import { Deck } from '../decks';
import { File, FileFactory, Paths } from '../file/file';
import { Arguments } from '../types';

export type NeedsLayout = {
  templatePaths: Paths;
  cards: Card[];
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

  export const pipeline = (
    args: Arguments,
    deck: Deck,
    cards$: Observable<Card[]>,
    endWatch$: Observable<boolean> | undefined,
  ) => {
    return Templates.findFactory(args, deck).pipe(
      mergeMap((templatesFactory) =>
        templatesFactory(args, deck, cards$, (args, path) =>
          File.factory(args, path, endWatch$),
        ),
      ),
      tap(({ templatePaths, cards }) =>
        console.log(
          'Requested layout for cards:',
          cards.map((card) => card.name).join(', '),
          'side:',
          cards[0].frontTemplate === templatePaths.filePath ? 'front' : 'back',
        ),
      ),
      shareReplay(),
    );
  };
}
