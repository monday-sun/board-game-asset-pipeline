type Renderer = {
  renderer: string;
  outputDir: string;
};

type Deck = {
  cardsParser: string;
  list: string;
  layout: string;
  outputDir: string;
  output: Renderer[];
};

export interface Config {
  deck: Deck[];
}

export { ConfigReader } from './yaml/yaml-config';
