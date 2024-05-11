#!/usr/bin/env node

import { Subscription } from 'rxjs';
import yargs from 'yargs';
import { Cards } from './cards';
import { OutputConfig } from './config';
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

Promise.all([
  Cards.findFactory(args),
  Templates.findFactory(args),
  Layout.findFactory(args),
]).then(([cardsFactory, templatesFactory, layoutFactory, outputFactory]) => {
  const deckConfig = config.deck[0];
  const cardsFile = File.factory(args, cardList);
  const cardsContent = FileContent.factory(args, cardsFile);

  const cards = cardsFactory(args, cardsContent);
  cards.cards$.subscribe(() => console.log('Loaded cards from', cardList));

  const templates = templatesFactory(args, cards, File.factory);
  templates.needsLayout$.subscribe(({ templatePaths }) =>
    console.log('Requested layout for template', templatePaths.filePath),
  );

  const layout = layoutFactory(args, templates);
  layout.layout$.subscribe(({ templatePaths, card }) =>
    console.log(
      'Generated layout for card',
      card.name,
      'with template',
      templatePaths.filePath,
    ),
  );

  const outputSubscriptions: Subscription[] = [];
  Promise.all(
    deckConfig.output.flatMap((outputConfig) =>
      subscribeOutput(outputConfig, layout),
    ),
  ).then((subscriptions) => {
    outputSubscriptions.concat(subscriptions);
  });
});

function subscribeOutput(outputConfig: OutputConfig, layout: Layout) {
  return Output.findOutputFactory(outputConfig).then((factory) => {
    const output = factory(outputConfig, layout);
    return output.generated$.subscribe((outputPath) => {
      console.log(`Generated output ${outputPath}`);
    });
  });
}
