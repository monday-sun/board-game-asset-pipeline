import { Subscription, combineLatest, map, mergeAll, switchMap } from 'rxjs';
import { Cards, CardsFactory } from '../cards';
import { Deck } from '../config';
import { File } from '../file/file';
import { Layout, LayoutFactory } from '../layout';
import { Output } from '../output';
import { Templates, TemplatesFactory } from '../templates';
import { Arguements } from '../types';

export function createDeckPipeline(args: Arguements, deckConfig: Deck) {
  const deckSubscriptions: Subscription[] = [];
  combineLatest([
    // find needed factories in parallel
    Cards.findFactory(args, deckConfig),
    Templates.findFactory(args, deckConfig),
    Layout.findFactory(args, deckConfig),
  ]).pipe(
    map(([cardsFactory, templatesFactory, layoutFactory]) => {
      return createLayoutPipeline(
        args,
        deckConfig,
        cardsFactory,
        templatesFactory,
        layoutFactory,
        deckSubscriptions,
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
  args: Arguements,
  deckConfig: Deck,
  cardsFactory: CardsFactory,
  templatesFactory: TemplatesFactory,
  layoutFactory: LayoutFactory,
  deckSubscriptions: Subscription[],
) {
  const cards$ = cardsFactory(args, deckConfig);
  deckSubscriptions.push(
    cards$.subscribe(() => console.log('Loaded cards from', deckConfig.list)),
  );

  const templates$ = templatesFactory(args, deckConfig, cards$, File.factory);
  deckSubscriptions.push(
    templates$.subscribe(({ templatePaths }) =>
      console.log('Requested layout for template', templatePaths.filePath),
    ),
  );

  const layout$ = layoutFactory(args, deckConfig, templates$);
  deckSubscriptions.push(
    layout$.subscribe(({ templatePaths, card }) =>
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
