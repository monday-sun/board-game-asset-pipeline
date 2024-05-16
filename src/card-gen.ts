#!/usr/bin/env ts-node

import { Subscription } from 'rxjs';
import yargs from 'yargs';
import { Deck } from './config';
import { createDeckPipeline } from './pipeline/deck-pipeline';
import { Arguements } from './types';

const args: Arguements = {
  ...yargs(process.argv.slice(2))
    .options({
      config: { type: 'string', default: 'config.yml', alias: 'c' },
      watch: { type: 'boolean', default: false, alias: 'w' },
    })
    .parseSync(),
  test: false,
};

const deckSubscriptions: Subscription[] = [];

Deck.factory(args).subscribe((deck) => {
  // Unsubscribe to any previous pipelines
  deckSubscriptions.forEach((subscription) => subscription.unsubscribe());

  deckSubscriptions.concat(createDeckPipeline(args, deck));
});
