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
  deck: DeckConfig[];
}

export { ConfigReader } from './yaml/yaml-config';
