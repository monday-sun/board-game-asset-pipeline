#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs';
import { Cards } from './cards';
import { FileContent } from './file-content';
import { findImageRenderer } from './image-renderer';
import { findLayoutRenderer } from './layout-renderer';
import { Arguements } from './types';

const args: Arguements = yargs(process.argv.slice(2))
  .options({
    cardList: { type: 'string', demandOption: true },
    outputDir: { type: 'string', default: 'output' },
    cardsParser: { type: 'string', default: 'csv' },
    layoutRenderer: { type: 'string', default: 'react' },
    imageRenderer: { type: 'string', default: 'nodeIndividual' },
    debugHtml: { type: 'boolean', default: false },
    watch: { type: 'boolean', default: false },
  })
  .parseSync();

const { cardList, outputDir, cardsParser, layoutRenderer, imageRenderer } =
  args;

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

Promise.all([
  FileContent.factory(args, args.cardList),
  Cards.findCardsParser(cardsParser),
  findLayoutRenderer(layoutRenderer),
  findImageRenderer(imageRenderer),
]).then(
  ([
    fileContent,
    createCardsParser,
    createLayoutRenderer,
    createImageRenderer,
  ]) => {
    const cardsParser = createCardsParser(args, fileContent);
    const layoutRenderer = createLayoutRenderer(args);
    const imageRenderer = createImageRenderer(args);

    return cardsParser.cards$.subscribe((cardInfos) => {
      return imageRenderer.toImages(cardInfos, layoutRenderer).then((files) => {
        console.log(`Rendered ${files.length} cards.`);
      });
    });
  },
);
