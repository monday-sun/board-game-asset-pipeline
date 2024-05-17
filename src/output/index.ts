import fs from 'fs';
import path from 'path';
import { Observable, from, map } from 'rxjs';
import { OutputConfig } from '../config';
import { LayoutResult } from '../layout';
import { Arguements } from '../types';

export type OutputFilename = string;

export type OutputFactory = (
  args: Arguements,
  config: OutputConfig,
  layout: Observable<LayoutResult>,
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
}
