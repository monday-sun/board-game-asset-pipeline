#!/usr/bin/env node

import { Card } from './card/card';
import { parseCsvToCardInfo } from './csv-to-card-info/csv-to-card-info';

const pathToCSV = './src/test-cards.csv';

let allPromises: Promise<void>[] = [];

parseCsvToCardInfo(pathToCSV).then(async (cardInfos) => {
  import('./react-to-html/react-to-html').then(({ layoutRenderer }) => {
    allPromises = cardInfos.map((cardInfo) => {
      return Card.from(cardInfo, layoutRenderer)
        .toHtml()
        .then(({ frontHtml, backHtml }) => {
          console.log('Front HTML: ', frontHtml);
          console.log('Back HTML: ', backHtml);
        });
    });
  });
});

Promise.all(allPromises).then(() => {
  console.log('All cards have been processed!');
});
