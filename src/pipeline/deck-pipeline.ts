import { Observable, merge, mergeMap, tap } from 'rxjs';
import { Card, Cards } from '../cards';
import { Deck, OutputConfig } from '../decks';
import { File } from '../file/file';
import { FileContent } from '../file/file-content';
import { Layout, LayoutResult } from '../layout';
import { Output, OutputFilename } from '../output';
import { NeedsLayout, Templates } from '../templates';
import { Arguments } from '../types';

function cardsPipeline(
  args: Arguments,
  deck: Deck,
  endWatch$: Observable<boolean> | undefined,
) {
  const file$ = File.factory(args, deck.list, endWatch$);
  const fileContent$ = FileContent.factory(args, file$);
  return Cards.findFactory(args, deck).pipe(
    mergeMap((cardsFactory) => cardsFactory(args, fileContent$)),
    tap(() => console.log('Loaded cards from', deck.list)),
  );
}

function templatesPipeline(
  args: Arguments,
  deck: Deck,
  cards$: Observable<Card[]>,
  endWatch$: Observable<boolean> | undefined,
) {
  return Templates.findFactory(args, deck).pipe(
    mergeMap((templatesFactory) =>
      templatesFactory(args, deck, cards$, (args, path) =>
        File.factory(args, path, endWatch$),
      ),
    ),
    tap(({ templatePaths, card }) =>
      console.log(
        'Requested layout for card:',
        card.name,
        'side:',
        card.frontTemplate === templatePaths.filePath ? 'front' : 'back',
      ),
    ),
  );
}

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
  const cards$ = cardsPipeline(args, deck, endWatch$);
  const templates$ = templatesPipeline(args, deck, cards$, endWatch$);
  const layout$ = layoutPipeline(args, deck, templates$);

  const outputPipelines: Observable<OutputFilename[]>[] = [];
  deck.output.forEach((outputConfig) => {
    outputPipelines.push(outputPipeline(args, outputConfig, layout$));
  });

  return merge(...outputPipelines);
}
