import path from 'path';
import { cwd } from 'process';
import { Observable, from, map } from 'rxjs';
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
}
