import path from 'path';
import { Observable, catchError, filter, from, map, mergeMap, of } from 'rxjs';
import { LayoutFactory, LayoutResult } from '..';
import { Card } from '../../cards';
import { Deck } from '../../decks';
import { NeedsLayout } from '../../templates';
import { Arguments } from '../../types';
import { ReactRender } from './react-render';

function executeInThisProcess(
  templatePath: string,
  cards: Card[],
  renderPath: string,
): Observable<LayoutResult[]> {
  return from(import('./react-render/' + renderPath)).pipe(
    map(({ render }) => render as ReactRender),
    mergeMap((render) => render(templatePath, cards)),
  );
}

function executeInChildProcess(
  templatePath: string,
  cards: Card[],
  renderPath: string,
): Observable<LayoutResult[]> {
  return from(import('child_process')).pipe(
    map(({ execFileSync }) =>
      execFileSync('ts-node', [
        path.join(__dirname, 'react-render', renderPath),
        templatePath,
        JSON.stringify(cards),
      ]),
    ),
    map((buffer) => buffer.toString()),
    map((json) => JSON.parse(json) as LayoutResult[]),
  );
}

function toHTML(
  templatePath: string,
  cards: Card[],
  process: 'this' | 'child',
  renderPath: string,
): Observable<LayoutResult[]> {
  const layoutPipeline =
    process === 'this'
      ? executeInThisProcess(templatePath, cards, renderPath)
      : executeInChildProcess(templatePath, cards, renderPath);
  return layoutPipeline.pipe(
    catchError((error) => {
      console.error('Error rendering React layout', error);
      return of([]);
    }),
    filter((layoutResults) => layoutResults.length > 0),
  );
}

export const factory: LayoutFactory = (
  args: Arguments,
  _: Deck,
  templates$: Observable<NeedsLayout>,
  reactRenderPath: string = 'react-render',
): Observable<LayoutResult> => {
  return templates$.pipe(
    mergeMap((needsLayout) =>
      toHTML(
        needsLayout.templatePaths.relativePath,
        needsLayout.cards,
        args.watch ? 'child' : 'this',
        reactRenderPath,
      ),
    ),
    mergeMap((layoutResults) => from(layoutResults)),
  );
};
