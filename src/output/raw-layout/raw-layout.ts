import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { Observable, from, map, mergeAll } from 'rxjs';
import { Output, OutputFactory } from '..';
import { Layout } from '../../layout';
import { Arguements } from '../../types';
import { createOutputFileName } from '../file-name/output-file-name';

export class RawLayout implements Output {
  generated$: Observable<string>;

  constructor(outputDir: string, layout: Layout) {
    const outputPath = path.join(outputDir, 'raw-layout');
    // Ensure the output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    this.generated$ = layout.layout$.pipe(
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
      map(({ outputPath, layout }) =>
        from(fsPromises.writeFile(outputPath, layout)).pipe(
          map(() => outputPath),
        ),
      ),
      mergeAll(),
    );
  }
}

export const factory: OutputFactory = (args: Arguements, layout: Layout) => {
  return new RawLayout(args.outputDir, layout);
};
