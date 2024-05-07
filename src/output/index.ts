import { Observable } from 'rxjs';
import { Templates } from '../templates/templates';
import { Arguements } from '../types';

export interface Output {
  generated$: Observable<string>;
}

export type OutputFactory = (args: Arguements, layouts: Templates) => Output;

export namespace Output {
  type OutputTypes = { nodeIndividual: string };

  const outputTypes: OutputTypes = {
    nodeIndividual: './node-html-to-image/node-individual-card-image-renderer',
  };

  export const findOutputFactory = (
    args: Arguements,
  ): Promise<OutputFactory> => {
    const type = args.imageRenderer;
    return (
      type in outputTypes
        ? import(outputTypes[type as keyof OutputTypes])
        : import(type)
    ).then(({ createImageRenderer }) => createImageRenderer);
  };
}
