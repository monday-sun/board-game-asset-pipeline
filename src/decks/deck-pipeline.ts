import { Observable, merge, mergeMap, tap } from 'rxjs';
import { Deck, OutputConfig } from '.';
import { Cards } from '../cards';
import { Layout, LayoutResult } from '../layout';
import { Output, OutputFilename } from '../output';
import { Templates } from '../templates';
import { Arguments } from '../types';

function outputPipeline(
  args: Arguments,
  outputConfig: OutputConfig,
  layout$: Observable<LayoutResult>,
) {
  return Output.findFactory(outputConfig).pipe(
    mergeMap((outputFactory) => outputFactory(args, outputConfig, layout$)),
    tap((outputPath) => console.log(`Generated output ${outputPath}`)),
  );
}

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
    outputPipelines.push(outputPipeline(args, outputConfig, layout$));
  });

  return merge(...outputPipelines);
}
