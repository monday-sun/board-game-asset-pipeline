#!/usr/bin/env node

import { Card } from './card/card';
import { parseCsvToCardInfo } from './csv-to-card-info/csv-to-card-info';

const pathToCSV = './src/test-cards.csv';

parseCsvToCardInfo(pathToCSV).then((cardInfos) => {
  const allPromises = cardInfos.map((cardInfo) => {
    return Card.from(cardInfo).toHtml().then(({frontHtml, backHtml}) => {
        console.log("Front HTML: ", frontHtml);
        console.log("Back HTML: ", backHtml);
    });
  });
});
