#!/usr/bin/env node

import { Subscription } from 'rxjs';
import yargs from 'yargs';
import { Cards } from './cards';
import { File } from './file/file';
import { FileContent } from './file/file-content';
import { Layout } from './layout';
import { Output } from './output';
import { Templates } from './templates';
import { Arguements } from './types';

const args: Arguements = {
  ...yargs(process.argv.slice(2))
    .options({
      cardList: { type: 'string', demandOption: true },
      outputDir: { type: 'string', default: 'generated' },
      cards: { type: 'string', default: 'papaparse' },
      layout: { type: 'string', default: 'react' },
      output: { type: 'string', default: 'raw' },
      watch: { type: 'boolean', default: false },
    })
    .parseSync(),
  test: false,
};

const config = {
  deck: [
    {
      cardsParser: args.cards,
      list: args.cardList,
      layout: args.layout,
      outputDir: args.outputDir,
      output: [{ renderer: args.output, rootOutputDir: args.outputDir }],
    },
  ],
};

const { cardList } = args;

const deckSubscriptions: Subscription[] = [];
const deckConfig = config.deck[0];

Promise.all([Cards.findFactory(args), Templates.findFactory(args)]).then(
  ([cardsFactory, templatesFactory]) => {
    const cardsFile = File.factory(args, cardList);
    const cardsContent = FileContent.factory(args, cardsFile);

    const cards = cardsFactory(args, cardsContent);
    deckSubscriptions.push(
      cards.cards$.subscribe(() => console.log('Loaded cards from', cardList)),
    );

    const templates = templatesFactory(args, cards, File.factory);
    deckSubscriptions.push(
      templates.needsLayout$.subscribe(({ templatePaths }) =>
        console.log('Requested layout for template', templatePaths.filePath),
      ),
    );

    Layout.findFactory(deckConfig)
      .then((layoutFactory) => {
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
  },
);
