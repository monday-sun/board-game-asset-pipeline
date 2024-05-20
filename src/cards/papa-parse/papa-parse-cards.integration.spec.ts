import { of } from 'rxjs';
import { Cards } from '..';
import { Deck } from '../../decks';
import { FileContent } from '../../file/file-content';
import { Arguments } from '../../types';
import { factory as testSubject } from './papa-parse-cards';

jest.mock('../../file/file-content');
describe('PapaParseCards', () => {
  it("completes factory pipeline with 'csv' parser", (done) => {
    let defined = false;
    const cardsFactory$ = Cards.findFactory(
      <Arguments>{},
      <Deck>{ cardsParser: 'csv' },
    );
    cardsFactory$.subscribe({
      next: (foundFactory) => {
        expect(foundFactory).toBe(testSubject);
        defined = true;
      },
      complete: () => {
        expect(defined).toBe(true);
        done();
      },
    });
  });

  it('parses cards from a CSV file', (done) => {
    const csvContent = `name,count,frontTemplate,backTemplate,customOption
Card1,1,Front1,Back1,Unknown1
Card2,2,Front2,Back2,Unknown2`;

    const content: FileContent = of({ filePath: '', content: csvContent });

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

    testSubject(<Arguments>{}, content).subscribe((cards) => {
      expect(cards).toEqual(expectedCards);
      done();
    });
  });

  it('throws error if no cards are parsed', (done) => {
    const csvContent = `name,count,frontTemplate,backTemplate,customOption`;
    const content: FileContent = of({ filePath: '', content: csvContent });

    testSubject({} as any, content).subscribe({
      error: (error) => {
        expect(error.message).toEqual('No cards parsed from CSV file.');
        done();
      },
    });
  });
});
