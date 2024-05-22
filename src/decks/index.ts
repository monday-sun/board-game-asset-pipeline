import { BehaviorSubject, Observable, merge, mergeMap, tap } from 'rxjs';
import { Cards } from '../cards';
import { File } from '../file/file';
import { FileContent } from '../file/file-content';
import { Layout } from '../layout';
import { Output, OutputFilename } from '../output';
import { Templates } from '../templates';
import { Arguments } from '../types';
import { factory as configFactory } from './yaml/yaml-decks';

export type OutputConfig = {
  renderer: string;
  outputDir?: string;
  rootOutputDir: string;
};

export type Deck = {
  cardsParser: string;
  list: string;
  layout: string;
  outputDir: string;
  output: OutputConfig[];
};

export type ConfigFactory = (
  args: Arguments,
  deck$: FileContent,
) => Observable<Deck>;

export namespace Deck {
  export const factory = configFactory;

  export const deckPipeline = (
    args: Arguments,
    deck: Deck,
    endWatch$?: Observable<boolean>,
  ) => {
    const cards$ = Cards.pipeline(args, deck, endWatch$);
    const templates$ = Templates.pipeline(args, deck, cards$, endWatch$);
    const layout$ = Layout.pipeline(args, deck, templates$);

    const outputPipelines: Observable<OutputFilename[]>[] = [];
    deck.output.forEach((outputConfig) => {
      outputPipelines.push(Output.pipeline(args, outputConfig, layout$));
    });

    return merge(...outputPipelines);
  };

  export const decksPipeline = (
    args: Arguments,
    endDecksWatch$: BehaviorSubject<boolean>,
  ) => {
    const endCardsAndTemplatesWatch$ = new BehaviorSubject<boolean>(false);

    const deckFile$ = File.factory(args, args.config, endDecksWatch$);
    const deckContent$ = FileContent.factory(args, deckFile$).pipe(
      // We're getting new decks, so stop watching on all current decks.
      tap(() => endCardsAndTemplatesWatch$.next(true)),
      // reset back to false
      tap(() => endCardsAndTemplatesWatch$.next(false)),
    );

    const decks$ = Deck.factory(args, deckContent$).pipe(
      mergeMap((deck) => Deck.deckPipeline(args, deck, endCardsAndTemplatesWatch$)),
    );
    return decks$;
  };
}
