#!/usr/bin/env ts-node

import { map } from 'rxjs';
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

let complete = false;
Deck.factory(args)
  .pipe(map((deck) => deckPipeline(args, deck)))
  .subscribe({
    complete: () => {
      complete = true;
    },
  });

function pollUntilComplete() {
  if (!complete) {
    setTimeout(pollUntilComplete, 1000); // Poll every 1 second (adjust as needed)
  }
}

pollUntilComplete();
