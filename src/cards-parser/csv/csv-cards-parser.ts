import fs from 'fs';
import * as Papa from 'papaparse';
import { CardInfo, CardsParser } from '../../types';

async function parseCsvToCardInfo(path: string): Promise<CardInfo[]> {
  const csvFile = fs.readFileSync(path, 'utf8');

  return new Promise((resolve, reject) => {
    Papa.parse<CardInfo>(csvFile, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data);
        }
      },
    });
  });
}

class CSVCardsParser implements CardsParser {
  parseCards(cardsDataPath: string): Promise<CardInfo[]> {
    return parseCsvToCardInfo(cardsDataPath);
  }
}

export function createCardsParser(): CardsParser {
  return new CSVCardsParser();
}
