#!/usr/bin/env ts-node

import { BehaviorSubject } from 'rxjs';
import yargs from 'yargs';
import { Deck } from './decks';
import { Arguments } from './types';

const args: Arguments = {
  ...yargs(process.argv.slice(2))
    .options({
      config: { type: 'string', default: 'config.yml', alias: 'c' },
      watch: { type: 'boolean', default: false, alias: 'w' },
      verbose: { type: 'boolean', default: false, alias: 'v' },
    })
    .parseSync(),
};

const endDecksWatch$ = new BehaviorSubject<boolean>(false);
let complete = false;

const decks$ = Deck.decksPipeline(args, endDecksWatch$);

decks$.subscribe({
  error: (err) => {
    console.error(err);
    process.exit(1);
  },
  complete: () => {
    complete = true;
    console.log('Completed deck pipeline');
  },
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing gracefully.');
  endDecksWatch$.next(true);
  if (complete) {
    process.exit(0);
  } else {
    decks$.subscribe({
      complete: () => process.exit(0),
      error: (err) => {
        console.error(err);
        process.exit(1);
      },
    });
  }
});

function pollUntilComplete() {
  if (!complete) {
    setTimeout(pollUntilComplete, 1000); // Poll every 1 second (adjust as needed)
  }
}

pollUntilComplete();
