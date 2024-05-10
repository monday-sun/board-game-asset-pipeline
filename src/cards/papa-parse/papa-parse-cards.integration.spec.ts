import { of } from 'rxjs';
import { Cards } from '..';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';

describe('PapaParseCards', () => {
  it('parses cards from a CSV file', (done) => {
    const csvContent = `name,count,frontTemplate,backTemplate,customOption
Card1,1,Front1,Back1,Unknown1
Card2,2,Front2,Back2,Unknown2`;
    const content: FileContent = {
      content$: of({ filePath: '', content: csvContent }),
    };
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
    Cards.findFactory(<Arguements>{ cards: 'papaparse' })
      .then((factory) => factory({} as any, content))
      .then((testSubject) => {
        testSubject.cards$.subscribe((cards) => {
          expect(cards).toEqual(expectedCards);
          done();
        });
      });
  });

  it('throws error if no cards are parsed', (done) => {
    const csvContent = `name,count,frontTemplate,backTemplate,customOption`;
    const content: FileContent = {
      content$: of({ filePath: '', content: csvContent }),
    };
    Cards.findFactory(<Arguements>{ cards: 'papaparse' })
      .then((factory) => factory({} as any, content))
      .then((testSubject) => {
        testSubject.cards$.subscribe({
          error: (error) => {
            expect(error.message).toEqual('No cards parsed from CSV file.');
            done();
          },
        });
      });
  });
});
