import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { Observable, from, map, mergeAll, mergeMap } from 'rxjs';
import { OutputFactory } from '..';
import { OutputConfig } from '../../config';
import { LayoutResult } from '../../layout';
import { Arguements } from '../../types';
import { createOutputFileName } from '../file-name/output-file-name';

export const factory: OutputFactory = (
  _: Arguements,
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
          result.card.frontTemplate === result.templatePaths.filePath
            ? 'front'
            : 'back',
        format: result.format,
      }),
      layout: result.layout,
    })),
    mergeMap(({ outputPath, layout }) =>
      from(fsPromises.writeFile(outputPath, layout)).pipe(
        map(() => [outputPath]),
      ),
    ),
  );
};
