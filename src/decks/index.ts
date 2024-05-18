import { Observable } from 'rxjs';
import { Arguments } from '../types';
import { factory as configFactory } from './yaml/yaml-decks';

export type OutputConfig = {
  renderer: string;
  outputDir?: string;
  rootOutputDir: string;
};

export type Deck = {
  cardsParser: string;
  list: string;
  layout: string;
  outputDir: string;
  output: OutputConfig[];
};

export type ConfigFactory = (args: Arguments) => Observable<Deck>;

export namespace Deck {
  export const factory = configFactory;
}
