import { of } from 'rxjs';
import { Cards } from '..';
import { Deck } from '../../decks';
import { FileContent } from '../../file/file-content';
import { Arguments } from '../../types';
import { factory as testSubject } from './yaml-cards';

jest.mock('../../file/file-content');
jest.mock('../../file/file');

describe('PapaParseCards', () => {
  it("completes factory pipeline with 'yaml' parser", (done) => {
    let defined = false;
    const cardsFactory$ = Cards.findFactory(
      <Arguments>{},
      <Deck>{ cardsParser: 'yaml' },
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
    const yaml = `
cards:
  card-1:
    count: 1
    frontTemplate: Front1
    backTemplate: Back1
    customOption: Unknown1
  card-2:
    count: 2
    frontTemplate: Front2
    backTemplate: Back2
    customOption: Unknown2
`;

    const content: FileContent = of({ filePath: '', content: yaml });

    const mockContentFactory = FileContent.factory as jest.MockedFunction<
      typeof FileContent.factory
    >;
    mockContentFactory.mockReturnValue(content);

    const expectedCards = [
      {
        name: 'card-1',
        count: 1,
        frontTemplate: 'Front1',
        backTemplate: 'Back1',
        customOption: 'Unknown1',
      },
      {
        name: 'card-2',
        count: 2,
        frontTemplate: 'Front2',
        backTemplate: 'Back2',
        customOption: 'Unknown2',
      },
    ];

    testSubject(<Arguments>{}, <Deck>{ list: 'fake/path.yaml' }).subscribe(
      (cards) => {
        expect(cards).toEqual(expectedCards);
        done();
      },
    );
  });
});
