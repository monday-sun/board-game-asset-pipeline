import path from 'path';
import { cwd } from 'process';
import { Observable, from, map, mergeMap, shareReplay, tap } from 'rxjs';
import { Card } from '../cards';
import { Deck } from '../decks';
import { Paths } from '../file/file';
import { NeedsLayout } from '../templates';
import { Arguments } from '../types';

export type LayoutResult = {
  templatePaths: Paths;
  card: Card;
  layout: string;
  format: string;
};

export type LayoutFactory = (
  args: Arguments,
  deck: Deck,
  templates$: Observable<NeedsLayout>,
) => Observable<LayoutResult>;

export namespace Layout {
  type LayoutRenderTypes = { react: string };

  const layoutRenderTypes: LayoutRenderTypes = {
    react: './react/react-layout',
  };

  export const findFactory = (
    _: Arguments,
    deck: Deck,
  ): Observable<LayoutFactory> => {
    const type = deck.layout;
    const importPath =
      type in layoutRenderTypes
        ? layoutRenderTypes[type as keyof LayoutRenderTypes]
        : path.join(cwd(), type);
    console.log('Rendering layouts with', importPath);
    return from(import(importPath)).pipe(map(({ factory }) => factory));
  };

  export const pipeline = (
    args: Arguments,
    deck: Deck,
    needsLayout$: Observable<NeedsLayout>,
  ) => {
    return Layout.findFactory(args, deck).pipe(
      mergeMap((layoutFactory) => layoutFactory(args, deck, needsLayout$)),
      tap(({ templatePaths, card }) =>
        console.log(
          'Generated layout for card:',
          card.name,
          'side:',
          card.frontTemplate === templatePaths.filePath ? 'front' : 'back',
        ),
      ),
      shareReplay(),
    );
  };
}
