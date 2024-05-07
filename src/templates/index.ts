import { Observable } from 'rxjs';
import { Card, Cards } from '../cards';
import { FileFactory } from '../file/file';
import { Arguements } from '../types';

export type NeedsLayout = {
  templatePath: string;
  card: Card;
};

export interface Templates {
  needsLayout$: Observable<NeedsLayout>;
}

export type TemplatesFactory = (
  args: Arguements,
  cards: Cards,
  fileFactory: FileFactory,
) => Templates;

export namespace Templates {
  export const findFactory = (args: Arguements): Promise<TemplatesFactory> => {
    return import('./templates').then(({ factory }) => factory);
  };
}
