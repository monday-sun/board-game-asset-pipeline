#!/usr/bin/env node

import yargs from 'yargs';
import { ConfigReader } from './config';
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

const config = new ConfigReader(args.config).getConfig();
if (!config) {
  console.error('Failed to load config');
  process.exit(1);
}

const deckConfig = config.decks[0];
console.log('Generating deck with config', deckConfig);
const deckSubscriptions = createDeckPipeline(args, deckConfig);
