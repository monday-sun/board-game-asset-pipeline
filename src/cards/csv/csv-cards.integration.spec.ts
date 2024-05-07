import { of } from 'rxjs';
import { FileContent } from '../../file-content';
import { createCardsParser } from './csv-cards';

describe('CSVCards', () => {
  it('parses cards from a CSV file', (done) => {
    const csvContent = `name,count,frontTemplate,backTemplate,customOption
Card1,1,Front1,Back1,Unknown1
Card2,2,Front2,Back2,Unknown2`;
    const contentProvider: FileContent = {
      content$: of(csvContent),
    };
    const testSubject = createCardsParser({} as any, contentProvider);

    const expectedCards = [
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
    ];

    testSubject.cards$.subscribe((cards) => {
      expect(cards).toEqual(expectedCards);
      done();
    });
  });
});
