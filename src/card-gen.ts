#!/usr/bin/env ts-node

import { switchMap } from 'rxjs';
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
  .pipe(switchMap((deck) => deckPipeline(args, deck)))
  .subscribe({
    error: (err) => {
      console.error(err);
      process.exit(1);
    },
    complete: () => {
      complete = true;
      console.log('Completed deck pipeline');
    },
  });

function pollUntilComplete() {
  if (!complete) {
    setTimeout(pollUntilComplete, 1000); // Poll every 1 second (adjust as needed)
  }
}

pollUntilComplete();
