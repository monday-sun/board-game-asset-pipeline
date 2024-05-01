#!/usr/bin/env node

import fs from 'fs';
const pathToCSV = './src/test-cards.csv';
const outputDir = 'output';

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

Promise.all([
  import('./cards-parser/csv/csv-cards-parser'),
  import('./layout-renderer/react/react-layout-renderer'),
  import(
    './image-renderer/node-html-to-image/node-individual-card-image-renderer'
  ),
])
  .then(
    ([
      { createCardsParser },
      { createLayoutRenderer },
      { createImageRenderer },
    ]) => {
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
