import { Observable, merge } from 'rxjs';
import { Deck } from '.';
import { Cards } from '../cards';
import { Layout } from '../layout';
import { Output, OutputFilename } from '../output';
import { Templates } from '../templates';
import { Arguments } from '../types';

export function deckPipeline(
  args: Arguments,
  deck: Deck,
  endWatch$?: Observable<boolean>,
) {
  const cards$ = Cards.pipeline(args, deck, endWatch$);
  const templates$ = Templates.pipeline(args, deck, cards$, endWatch$);
  const layout$ = Layout.pipeline(args, deck, templates$);

  const outputPipelines: Observable<OutputFilename[]>[] = [];
  deck.output.forEach((outputConfig) => {
    outputPipelines.push(Output.pipeline(args, outputConfig, layout$));
  });

  return merge(...outputPipelines);
}
