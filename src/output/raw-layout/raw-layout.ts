import fsPromises from 'fs/promises';
import path from 'path';
import { Observable, from, map, switchMap } from 'rxjs';
import { Output, OutputFactory } from '..';
import { Layout } from '../../layout';
import { Arguements } from '../../types';
import { createOutputFileName } from '../file-name/output-file-name';

export class RawLayout implements Output {
  generated$: Observable<string>;

  constructor(outputDir: string, layout: Layout) {
    this.generated$ = layout.layout$.pipe(
      map((result) => ({
        outputPath: createOutputFileName({
          outputPath: path.join(outputDir, 'raw-layout'),
          cardName: result.card.name,
          suffix: result.card.count,
          format: result.format,
        }),
        layout: result.layout,
      })),
      switchMap(({ outputPath, layout }) =>
        from(fsPromises.writeFile(outputPath, layout).then(() => outputPath)),
      ),
    );
  }
}

export const factory: OutputFactory = (args: Arguements, layout: Layout) => {
  return new RawLayout(args.outputDir, layout);
};
