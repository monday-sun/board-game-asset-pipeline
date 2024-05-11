#!/usr/bin/env node

import yargs from 'yargs';
import { createDeckPipeline } from './pipeline/deck-pipeline';
import { Arguements } from './types';

const args: Arguements = {
  ...yargs(process.argv.slice(2))
    .options({
      config: { type: 'string', default: 'config.yaml' },
      cardList: { type: 'string', default: 'cards.csv' },
      outputDir: { type: 'string', default: 'generated' },
      cards: { type: 'string', default: 'papaparse' },
      layout: { type: 'string', default: 'react' },
      output: { type: 'string', default: 'raw' },
      watch: { type: 'boolean', default: false },
    })
    .parseSync(),
  test: false,
};

const config = {
  deck: [
    {
      cardsParser: args.cards,
      list: args.cardList,
      layout: args.layout,
      outputDir: args.outputDir,
      output: [{ renderer: args.output, rootOutputDir: args.outputDir }],
    },
  ],
};

const deckConfig = config.deck[0];
console.log('Generating deck with config', deckConfig);
const deckSubscriptions = createDeckPipeline(args, deckConfig);
