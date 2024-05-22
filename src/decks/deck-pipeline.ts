import { Observable, merge, mergeMap, shareReplay, tap } from 'rxjs';
import { Deck, OutputConfig } from '.';
import { Cards } from '../cards';
import { Layout, LayoutResult } from '../layout';
import { Output, OutputFilename } from '../output';
import { NeedsLayout, Templates } from '../templates';
import { Arguments } from '../types';

function layoutPipeline(
  args: Arguments,
  deck: Deck,
  needsLayout$: Observable<NeedsLayout>,
) {
  return Layout.findFactory(args, deck).pipe(
    mergeMap((layoutFactory) => layoutFactory(args, deck, needsLayout$)),
    tap(({ templatePaths, card }) =>
      console.log(
        'Generated layout for card:',
        card.name,
        'side:',
        card.frontTemplate === templatePaths.filePath ? 'front' : 'back',
      ),
    ),
    shareReplay(),
  );
}

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
  const layout$ = layoutPipeline(args, deck, templates$);

  const outputPipelines: Observable<OutputFilename[]>[] = [];
  deck.output.forEach((outputConfig) => {
    outputPipelines.push(outputPipeline(args, outputConfig, layout$));
  });

  return merge(...outputPipelines);
}
