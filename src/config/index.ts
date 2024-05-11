import { Observable } from 'rxjs';
import { Arguements } from '../types';
import { factory as configFactory } from './yaml/yaml-config';

export type OutputConfig = {
  renderer: string;
  outputDir?: string;
  rootOutputDir: string;
};

export type DeckConfig = {
  cardsParser: string;
  list: string;
  layout: string;
  outputDir: string;
  output: OutputConfig[];
};

export interface Config {
  decks: Observable<DeckConfig[]>;
}

export type ConfigFactory = (args: Arguements) => Config;

export namespace Config {
  export const factory = configFactory;
}
