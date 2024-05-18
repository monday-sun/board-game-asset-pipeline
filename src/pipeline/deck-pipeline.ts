import {
  Subscription,
  combineLatest,
  map,
  mergeAll,
  switchMap,
  tap,
} from 'rxjs';
import { Cards, CardsFactory } from '../cards';
import { Deck } from '../decks';
import { File } from '../file/file';
import { Layout, LayoutFactory } from '../layout';
import { Output } from '../output';
import { Templates, TemplatesFactory } from '../templates';
import { Arguments } from '../types';

function gatherLayoutFactories(args: Arguments, deck: Deck) {
  return combineLatest([
    Cards.findFactory(args, deck),
    Templates.findFactory(args, deck),
    Layout.findFactory(args, deck),
  ]);
}

export function createDeckPipeline(args: Arguments, deckConfig: Deck) {
  const deckSubscriptions: Subscription[] = [];
  gatherLayoutFactories(args, deckConfig).pipe(
    map(([cardsFactory, templatesFactory, layoutFactory]) => {
      return createLayoutPipeline(
        args,
        deckConfig,
        cardsFactory,
        templatesFactory,
        layoutFactory,
      );
    }),
    map((layout$) =>
      deckConfig.output.map((outputConfig) => ({ layout$, outputConfig })),
    ),
    mergeAll(),
    switchMap(({ layout$, outputConfig }) =>
      Output.findFactory(outputConfig).pipe(
        map((factory) => ({ layout$, outputConfig, factory })),
      ),
    ),
    map(({ layout$, outputConfig, factory }) => {
      const generated$ = factory(args, outputConfig, layout$);
      deckSubscriptions.push(
        generated$.subscribe((outputPath) => {
          console.log(`Generated output ${outputPath}`);
        }),
      );

      return generated$;
    }),
  );
  return deckSubscriptions;
}

function createLayoutPipeline(
  args: Arguments,
  deckConfig: Deck,
  cardsFactory: CardsFactory,
  templatesFactory: TemplatesFactory,
  layoutFactory: LayoutFactory,
) {
  const cards$ = cardsFactory(args, deckConfig).pipe(
    tap(() => console.log('Loaded cards from', deckConfig.list)),
  );

  const templates$ = templatesFactory(
    args,
    deckConfig,
    cards$,
    File.factory,
  ).pipe(
    tap(({ templatePaths }) =>
      console.log('Requested layout for template', templatePaths.filePath),
    ),
  );

  const layout$ = layoutFactory(args, deckConfig, templates$).pipe(
    tap(({ templatePaths, card }) =>
      console.log(
        'Generated layout for card',
        card.name,
        'with template',
        templatePaths.filePath,
      ),
    ),
  );

  return layout$;
}
