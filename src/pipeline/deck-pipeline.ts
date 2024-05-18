import { Observable, merge, switchMap, tap } from 'rxjs';
import { Card, Cards } from '../cards';
import { Deck, OutputConfig } from '../decks';
import { File } from '../file/file';
import { Layout, LayoutResult } from '../layout';
import { Output, OutputFilename } from '../output';
import { NeedsLayout, Templates } from '../templates';
import { Arguments } from '../types';

function cardsPipeline(args: Arguments, deck: Deck) {
  return Cards.findFactory(args, deck).pipe(
    switchMap((cardsFactory) => cardsFactory(args, deck)),
    tap(() => console.log('Loaded cards from', deck.list)),
  );
}

function templatesPipeline(
  args: Arguments,
  deck: Deck,
  cards$: Observable<Card[]>,
) {
  return Templates.findFactory(args, deck).pipe(
    switchMap((templatesFactory) =>
      templatesFactory(args, deck, cards$, File.factory),
    ),
    tap(({ templatePaths }) =>
      console.log('Requested layout for template', templatePaths.filePath),
    ),
  );
}

function layoutPipeline(
  args: Arguments,
  deck: Deck,
  needsLayout$: Observable<NeedsLayout>,
) {
  return Layout.findFactory(args, deck).pipe(
    switchMap((layoutFactory) => layoutFactory(args, deck, needsLayout$)),
    tap(({ templatePaths, card }) =>
      console.log(
        'Generated layout for card',
        card.name,
        'with template',
        templatePaths.filePath,
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
    switchMap((outputFactory) => outputFactory(args, outputConfig, layout$)),
    tap((outputPath) => console.log(`Generated output ${outputPath}`)),
  );
}

export function deckPipeline(args: Arguments, deck: Deck) {
  const cards$ = cardsPipeline(args, deck);
  const templates$ = templatesPipeline(args, deck, cards$);
  const layout$ = layoutPipeline(args, deck, templates$);

  const outputPipelines: Observable<OutputFilename[]>[] = [];
  deck.output.forEach((outputConfig) => {
    outputPipelines.push(outputPipeline(args, outputConfig, layout$));
  });

  return merge(...outputPipelines);
}
