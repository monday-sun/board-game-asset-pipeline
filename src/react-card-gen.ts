#!/usr/bin/env node

import fs from 'fs';
import { findCardsParser } from './cards-parser';
import { findLayoutRenderer } from './layout-renderer';
const pathToCSV = './src/test-cards.csv';
const outputDir = 'output';

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

Promise.all([
  findCardsParser('csv'),
  findLayoutRenderer('react'),
  import(
    './image-renderer/node-html-to-image/node-individual-card-image-renderer'
  ),
])
  .then(
    ([createCardsParser, createLayoutRenderer, { createImageRenderer }]) => {
      const cardsParser = createCardsParser();
      const layoutRenderer = createLayoutRenderer();
      const imageRenderer = createImageRenderer(outputDir);

      return cardsParser.parseCards(pathToCSV).then((cardInfos) => {
        return imageRenderer.toImages(cardInfos, layoutRenderer);
      });
    },
  )
  .then((files) => {
    console.log(`Rendered ${files.length} cards.`);
  });
