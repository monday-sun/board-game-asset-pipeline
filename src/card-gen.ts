#!/usr/bin/env ts-node

import { Subscription } from 'rxjs';
import yargs from 'yargs';
import { Deck } from './decks';
import { deckPipeline } from './pipeline/deck-pipeline';
import { Arguments } from './types';

const args: Arguments = {
  ...yargs(process.argv.slice(2))
    .options({
      config: { type: 'string', default: 'config.yml', alias: 'c' },
      watch: { type: 'boolean', default: false, alias: 'w' },
    })
    .parseSync(),
};

const deckSubscriptions: Subscription[] = [];

Deck.factory(args).subscribe((deck) => {
  // Unsubscribe to any previous pipelines
  deckSubscriptions.forEach((subscription) => subscription.unsubscribe());

  deckSubscriptions.concat(deckPipeline(args, deck));
});
