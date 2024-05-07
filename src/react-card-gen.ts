#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs';
import { Cards } from './cards';
import { findImageRenderer } from './output';
import { Layout } from './layout';
import { Arguements } from './types';

const args: Arguements = yargs(process.argv.slice(2))
  .options({
    cardList: { type: 'string', demandOption: true },
    outputDir: { type: 'string', default: 'output' },
    cardsParser: { type: 'string', default: 'csv' },
    layout: { type: 'string', default: 'react' },
    imageRenderer: { type: 'string', default: 'nodeIndividual' },
    debugHtml: { type: 'boolean', default: false },
    watch: { type: 'boolean', default: false },
  })
  .parseSync();

const { cardList, outputDir, cardsParser, layout, imageRenderer } = args;

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

Promise.all([
  Cards.findFactory(args),
  Layout.findFactory(args),
  findImageRenderer(imageRenderer),
]).then(([cardsFactory, layoutFactory, createImageRenderer]) => {
  //   const layoutRenderer = createLayoutRenderer(args);
  //   const imageRenderer = createImageRenderer(args);
  //   return cards.cards$.subscribe((cardInfos) => {
  //     return imageRenderer.toImages(cardInfos, layoutRenderer).then((files) => {
  //       console.log(`Rendered ${files.length} cards.`);
  //     });
  //   });
});
