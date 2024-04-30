#!/usr/bin/env node

import { Card } from './card/card';
import { parseCsvToCardInfo } from './csv-to-card-info/csv-to-card-info';
import { ReactLayoutRenderer } from './react-to-html/react-to-html';

const pathToCSV = './src/test-cards.csv';

parseCsvToCardInfo(pathToCSV).then((cardInfos) => {
  const layoutRenderer = new ReactLayoutRenderer();
  const allPromises = cardInfos.map((cardInfo) => {
    return Card.from(cardInfo, layoutRenderer)
      .toHtml()
      .then(({ frontHtml, backHtml }) => {
        console.log('Front HTML: ', frontHtml);
        console.log('Back HTML: ', backHtml);
      });
  });
});
