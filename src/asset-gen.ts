#!/usr/bin/env ts-node

import { BehaviorSubject, mergeMap, tap } from 'rxjs';
import yargs from 'yargs';
import { Deck } from './decks';
import { File } from './file/file';
import { FileContent } from './file/file-content';
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

const decks$ = decksPipeline(args, endDecksWatch$);

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

function decksPipeline(args: Arguments, endDecksWatch$: BehaviorSubject<boolean>) {
  const endCardsAndTemplatesWatch$ = new BehaviorSubject<boolean>(false);

  const deckFile$ = File.factory(args, args.config, endDecksWatch$);
  const deckContent$ = FileContent.factory(args, deckFile$).pipe(
    // We're getting new decks, so stop watching on all current decks.
    tap(() => endCardsAndTemplatesWatch$.next(true)),
    // reset back to false
    tap(() => endCardsAndTemplatesWatch$.next(false))
  );

  const decks$ = Deck.factory(args, deckContent$).pipe(
    mergeMap((deck) => Deck.pipeline(args, deck, endCardsAndTemplatesWatch$))
  );
  return decks$;
}

function pollUntilComplete() {
  if (!complete) {
    setTimeout(pollUntilComplete, 1000); // Poll every 1 second (adjust as needed)
  }
}

pollUntilComplete();
