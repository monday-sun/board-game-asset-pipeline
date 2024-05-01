#!/usr/bin/env node

import { Card } from './card/card';

const pathToCSV = './src/test-cards.csv';

let allPromises: Promise<void>[] = [];

import('./cards-parser/csv/csv-cards-parser').then(({ createCardsParser }) => {
  createCardsParser()
    .parseCards(pathToCSV)
    .then(async (cardInfos) => {
      import('./layout-renderer/react/react-layout-renderer').then(
        ({ createLayoutRenderer }) => {
          const layoutRenderer = createLayoutRenderer();
          allPromises = cardInfos.map((cardInfo) => {
            return Card.from(cardInfo, layoutRenderer)
              .toHtml()
              .then(({ frontHtml, backHtml }) => {
                console.log('Front HTML: ', frontHtml);
                console.log('Back HTML: ', backHtml);
              });
          });
        },
      );
    });
});

Promise.all(allPromises).then(() => {
  console.log('All cards have been processed!');
});
