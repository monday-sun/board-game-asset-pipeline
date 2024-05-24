import path from 'path';
import {
  Observable,
  OperatorFunction,
  catchError,
  filter,
  from,
  map,
  mergeMap,
  of,
} from 'rxjs';
import { LayoutFactory, LayoutResult } from '..';
import { Deck } from '../../decks';
import { NeedsLayout } from '../../templates';
import { Arguments } from '../../types';
import { ReactRender } from './react-render';

function executeInThisProcess(
  templatePath: string,
  data: Record<string, string>,
  renderPath: string,
): Observable<LayoutResult> {
  return from(import('./react-render/' + renderPath)).pipe(
    map(({ render }) => render as ReactRender),
    mergeMap((render) => render(templatePath, data)),
  );
}

function executeInChildProcess(
  templatePath: string,
  data: Record<string, string>,
  renderPath: string,
): Observable<LayoutResult> {
  return from(import('child_process')).pipe(
    map(({ execFileSync }) =>
      execFileSync('ts-node', [
        path.join(__dirname, 'react-render', renderPath),
        templatePath,
        JSON.stringify(data),
      ]),
    ),
    map((buffer) => buffer.toString()),
    map((json) => JSON.parse(json) as LayoutResult),
  );
}

function toHTML(
  templatePath: string,
  data: Record<string, string>,
  process: 'this' | 'child',
  renderPath: string,
): Observable<LayoutResult> {
  const layoutPipeline =
    process === 'this'
      ? executeInThisProcess(templatePath, data, renderPath)
      : executeInChildProcess(templatePath, data, renderPath);
  return layoutPipeline.pipe(
    catchError((error) => {
      console.error('Error rendering React layout', error);
      return of(undefined);
    }),
    filter((layout) => !!layout) as OperatorFunction<
      LayoutResult | undefined,
      LayoutResult
    >,
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
      needsLayout.cards.map((card) => ({
        card,
        templatePaths: needsLayout.templatePaths,
      })),
    ),
    mergeMap((needsLayout) =>
      toHTML(
        needsLayout.templatePaths.relativePath,
        needsLayout.card,
        args.watch ? 'child' : 'this',
        reactRenderPath,
      ),
    ),
  );
};
