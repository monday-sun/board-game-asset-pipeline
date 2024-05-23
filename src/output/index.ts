import fs from 'fs';
import path from 'path';
import { Observable, from, map, mergeMap, tap } from 'rxjs';
import { OutputConfig } from '../decks';
import { LayoutResult } from '../layout';
import { Arguments } from '../types';

export type OutputFilename = string;

export type OutputFactory = (
  args: Arguments,
  config: OutputConfig,
  layout$: Observable<LayoutResult>,
) => Observable<OutputFilename[]>;

export namespace Output {
  type OutputTypes = { nodeIndividual: string; raw: string };

  const outputTypes: OutputTypes = {
    nodeIndividual: './node-html-to-image/node-individual-card-image-renderer',
    raw: './raw-layout/raw-layout',
  };

  export const findFactory = (
    config: OutputConfig,
  ): Observable<OutputFactory> => {
    const type = config.renderer;
    const importPath =
      type in outputTypes
        ? outputTypes[type as keyof OutputTypes]
        : path.join(process.cwd(), type);

    // Ensure the output directory exists
    if (!fs.existsSync(config.rootOutputDir)) {
      fs.mkdirSync(config.rootOutputDir, { recursive: true });
    }

    console.log('Saving output with', importPath);
    return from(import(importPath)).pipe(map(({ factory }) => factory));
  };

  export const pipeline = (
    args: Arguments,
    outputConfig: OutputConfig,
    layout$: Observable<LayoutResult>,
  ) => {
    return Output.findFactory(outputConfig).pipe(
      mergeMap((outputFactory) => outputFactory(args, outputConfig, layout$)),
      tap((outputPath) => console.log(`Generated output ${outputPath}`)),
    );
  };
}
