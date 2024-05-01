#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs';
import { findCardsParser } from './cards-parser';
import { findImageRenderer } from './image-renderer';
import { findLayoutRenderer } from './layout-renderer';

const { cardList, outputDir, cardsParser, layoutRenderer, imageRenderer } =
  yargs(process.argv.slice(2))
    .options({
      cardList: { type: 'string', demandOption: true },
      outputDir: { type: 'string', default: 'output' },
      cardsParser: { type: 'string', default: 'csv' },
      layoutRenderer: { type: 'string', default: 'react' },
      imageRenderer: { type: 'string', default: 'nodeIndividual' },
    })
    .parseSync();

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

Promise.all([
  findCardsParser(cardsParser),
  findLayoutRenderer(layoutRenderer),
  findImageRenderer(imageRenderer),
])
  .then(([createCardsParser, createLayoutRenderer, createImageRenderer]) => {
    const cardsParser = createCardsParser();
    const layoutRenderer = createLayoutRenderer();
    const imageRenderer = createImageRenderer(outputDir);

    return cardsParser.parseCards(cardList).then((cardInfos) => {
      return imageRenderer.toImages(cardInfos, layoutRenderer);
    });
  })
  .then((files) => {
    console.log(`Rendered ${files.length} cards.`);
  });
