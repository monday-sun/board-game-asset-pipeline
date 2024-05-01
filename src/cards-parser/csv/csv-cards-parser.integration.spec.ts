import fs from 'fs';
import { createCardsParser } from './csv-cards-parser';

jest.mock('fs');

describe('parseCsvToCardInfo', () => {
  const fakeCSVPath = 'path/to/file.csv';
  beforeEach(() => {
    (fs.readFileSync as jest.Mock)
      .mockReturnValue(`name,count,frontTemplate,backTemplate,customOption
Card1,1,Front1,Back1,Unknown1
Card2,2,Front2,Back2,Unknown2`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse a CSV file into a list of CardInfo', async () => {
    const testSubject = createCardsParser({} as any);
    const cardInfos = await testSubject.parseCards(fakeCSVPath);
    expect(cardInfos).toEqual([
      {
        name: 'Card1',
        count: '1',
        frontTemplate: 'Front1',
        backTemplate: 'Back1',
        customOption: 'Unknown1',
      },
      {
        name: 'Card2',
        count: '2',
        frontTemplate: 'Front2',
        backTemplate: 'Back2',
        customOption: 'Unknown2',
      },
    ]);
  });
});
