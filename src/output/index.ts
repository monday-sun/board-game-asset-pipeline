import fs from 'fs';
import path from 'path';
import { Observable } from 'rxjs';
import { OutputConfig } from '../config';
import { Layout } from '../layout';
import { Arguements } from '../types';

export interface Output {
  generated$: Observable<string[]>;
}

export type OutputFactory = (
  args: Arguements,
  config: OutputConfig,
  layout: Layout,
) => Output;

export namespace Output {
  type OutputTypes = { nodeIndividual: string; raw: string };

  const outputTypes: OutputTypes = {
    nodeIndividual: './node-html-to-image/node-individual-card-image-renderer',
    raw: './raw-layout/raw-layout',
  };

  export const findOutputFactory = (
    config: OutputConfig,
  ): Promise<OutputFactory> => {
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
    return import(importPath).then(({ factory }) => factory);
  };
}
