import fs from 'fs';
import path from 'path';
import { Observable } from 'rxjs';
import { Layout } from '../layout';
import { Arguements } from '../types';

export interface Output {
  generated$: Observable<string>;
}

export type OutputFactory = (args: Arguements, layout: Layout) => Output;

export namespace Output {
  type OutputTypes = { nodeIndividual: string; raw: string };

  const outputTypes: OutputTypes = {
    nodeIndividual: './node-html-to-image/node-individual-card-image-renderer',
    raw: './raw-layout/raw-layout',
  };

  export const findOutputFactory = (
    args: Arguements,
  ): Promise<OutputFactory> => {
    const type = args.output;
    const importPath =
      type in outputTypes
        ? outputTypes[type as keyof OutputTypes]
        : path.join(process.cwd(), type);

    // Ensure the output directory exists
    if (!fs.existsSync(args.outputDir)) {
      fs.mkdirSync(args.outputDir);
    }

    console.log('Saving output with', importPath);
    return import(importPath).then(({ factory }) => factory);
  };
}
