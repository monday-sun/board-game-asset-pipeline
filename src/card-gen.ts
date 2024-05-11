#!/usr/bin/env node

import yargs from 'yargs';
import { Config } from './config';
import { createDeckPipeline } from './pipeline/deck-pipeline';
import { Arguements } from './types';

const args: Arguements = {
  ...yargs(process.argv.slice(2))
    .options({
      config: { type: 'string', default: 'config.yaml' },
      watch: { type: 'boolean', default: false },
    })
    .parseSync(),
  test: false,
};

Config.factory(args).decks.subscribe((decks) => {
  const deckSubscriptions = decks.flatMap((deck) => {
    console.log('Generating deck with config', deck);
    return createDeckPipeline(args, deck);
  });
});
