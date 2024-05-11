import { Observable } from 'rxjs';
import { Card, Cards } from '../cards';
import { DeckConfig } from '../config';
import { FileFactory, Paths } from '../file/file';
import { Arguements } from '../types';

export type NeedsLayout = {
  templatePaths: Paths;
  card: Card;
};

export interface Templates {
  needsLayout$: Observable<NeedsLayout>;
}

export type TemplatesFactory = (
  args: Arguements,
  deckConfig: DeckConfig,
  cards: Cards,
  fileFactory: FileFactory,
) => Templates;

export namespace Templates {
  export const findFactory = (
    args: Arguements,
    deckConfig: DeckConfig,
  ): Promise<TemplatesFactory> => {
    return import('./templates').then(({ factory }) => factory);
  };
}
