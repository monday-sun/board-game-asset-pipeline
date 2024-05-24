import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import * as prettier from 'prettier';
import { Observable, catchError, filter, from, map, mergeMap, of } from 'rxjs';
import { OutputFactory } from '..';
import { OutputConfig } from '../../decks';
import { LayoutResult } from '../../layout';
import { Arguments } from '../../types';
import { createOutputFileName } from '../file-name/output-file-name';

export const factory: OutputFactory = (
  _: Arguments,
  config: OutputConfig,
  layout$: Observable<LayoutResult>,
) => {
  const outputPath = path.join(
    config.rootOutputDir,
    config.outputDir || 'raw-layout',
  );
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  return layout$.pipe(
    map((result) => ({
      outputPath: createOutputFileName({
        outputPath: outputPath,
        cardName: result.card.name,
        suffix:
          result.card.frontTemplate === result.template ? 'front' : 'back',
        format: result.format,
      }),
      format: result.format,
      layout: result.layout,
    })),
    mergeMap(({ outputPath, format, layout: originalLayout }) =>
      from(prettier.format(originalLayout, { parser: format })).pipe(
        catchError((error) => {
          console.error('Error formatting layout', error);
          return of(originalLayout);
        }),
        map((prettierLayout) => ({ outputPath, layout: prettierLayout })),
      ),
    ),
    mergeMap(({ outputPath, layout }) =>
      from(fsPromises.writeFile(outputPath, layout)).pipe(
        map(() => [outputPath]),
        catchError((error) => {
          console.error('Error writing file', error);
          return of([]);
        }),
      ),
    ),
    filter((output) => output.length > 0),
  );
};
