import { Subscription, lastValueFrom } from 'rxjs';
import { Cards } from '../cards';
import { Deck } from '../config';
import { File } from '../file/file';
import { Layout } from '../layout';
import { Output } from '../output';
import { Templates } from '../templates';
import { Arguements } from '../types';

export function createDeckPipeline(args: Arguements, deckConfig: Deck) {
  const deckSubscriptions: Subscription[] = [];
  Promise.all([
    lastValueFrom(Cards.findFactory(args, deckConfig)),
    lastValueFrom(Templates.findFactory(args, deckConfig)),
    lastValueFrom(Layout.findFactory(args, deckConfig)),
  ])
    .then(([cardsFactory, templatesFactory, layoutFactory]) => {
      const cards$ = cardsFactory(args, deckConfig);
      deckSubscriptions.push(
        cards$.subscribe(() =>
          console.log('Loaded cards from', deckConfig.list),
        ),
      );

      const templates$ = templatesFactory(
        args,
        deckConfig,
        cards$,
        File.factory,
      );
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
    })
    .then((layout) => {
      deckConfig.output.forEach((outputConfig) =>
        lastValueFrom(Output.findFactory(outputConfig)).then((factory) => {
          const generated$ = factory(args, outputConfig, layout);

          deckSubscriptions.push(
            generated$.subscribe((outputPath) => {
              console.log(`Generated output ${outputPath}`);
            }),
          );

          return generated$;
        }),
      );
    });
  return deckSubscriptions;
}
