#!/usr/bin/env node

const pathToCSV = './src/test-cards.csv';

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
      const imageRenderer = createImageRenderer();

      return cardsParser.parseCards(pathToCSV).then((cardInfos) => {
        return imageRenderer.toImages(cardInfos, layoutRenderer);
      });
    },
  )
  .then((files) => {
    console.log(`Rendered ${files.length} cards.`);
  });
