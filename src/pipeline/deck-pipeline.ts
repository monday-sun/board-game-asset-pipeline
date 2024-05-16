import { Subscription } from 'rxjs';
import { Cards } from '../cards';
import { File } from '../file/file';
import { Layout } from '../layout';
import { Output } from '../output';
import { Templates } from '../templates';
import { Arguements } from '../types';
import { Deck } from '../config';

export function createDeckPipeline(args: Arguements, deckConfig: Deck) {
  const deckSubscriptions: Subscription[] = [];
  Promise.all([
    Cards.findFactory(args, deckConfig),
    Templates.findFactory(args, deckConfig),
    Layout.findFactory(args, deckConfig),
  ])
    .then(([cardsFactory, templatesFactory, layoutFactory]) => {
      const cards = cardsFactory(args, deckConfig);
      deckSubscriptions.push(
        cards.cards$.subscribe(() =>
          console.log('Loaded cards from', deckConfig.list),
        ),
      );

      const templates = templatesFactory(args, deckConfig, cards, File.factory);
      deckSubscriptions.push(
        templates.needsLayout$.subscribe(({ templatePaths }) =>
          console.log('Requested layout for template', templatePaths.filePath),
        ),
      );

      const layout = layoutFactory(args, deckConfig, templates);
      deckSubscriptions.push(
        layout.layout$.subscribe(({ templatePaths, card }) =>
          console.log(
            'Generated layout for card',
            card.name,
            'with template',
            templatePaths.filePath,
          ),
        ),
      );

      return layout;
    })
    .then((layout) => {
      deckConfig.output.forEach((outputConfig) =>
        Output.findOutputFactory(outputConfig).then((factory) => {
          const output = factory(args, outputConfig, layout);

          deckSubscriptions.push(
            output.generated$.subscribe((outputPath) => {
              console.log(`Generated output ${outputPath}`);
            }),
          );

          return output;
        }),
      );
    });
  return deckSubscriptions;
}
