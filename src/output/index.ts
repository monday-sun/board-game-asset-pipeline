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
    return (
      type in outputTypes
        ? import(outputTypes[type as keyof OutputTypes])
        : import(type)
    ).then(({ factory }) => factory);
  };
}
