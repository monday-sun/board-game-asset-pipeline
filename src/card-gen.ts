#!/usr/bin/env ts-node

import { Subscription } from 'rxjs';
import yargs from 'yargs';
import { Config } from './config';
import { createDeckPipeline } from './pipeline/deck-pipeline';
import { Arguements } from './types';

const args: Arguements = {
  ...yargs(process.argv.slice(2))
    .options({
      config: { type: 'string', default: 'config.yml' },
      watch: { type: 'boolean', default: false },
    })
    .parseSync(),
  test: false,
};

const deckSubscriptions: Subscription[] = [];

Config.factory(args).decks.subscribe((decks) => {
  // Unsubscribe to any previous pipelines
  deckSubscriptions.forEach((subscription) => subscription.unsubscribe());

  deckSubscriptions.concat(
    decks.flatMap((deck) => {
      console.log('Generating deck with config', deck);
      return createDeckPipeline(args, deck);
    }),
  );
});
