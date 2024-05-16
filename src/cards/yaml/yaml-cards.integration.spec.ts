import { of } from 'rxjs';
import { Cards } from '..';
import { DeckConfig } from '../../config';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';

jest.mock('../../file/file-content');
describe('PapaParseCards', () => {
  it('parses cards from a CSV file', (done) => {
    const yaml = `
cards:
  - name: Card1
    count: 1
    frontTemplate: Front1
    backTemplate: Back1
    customOption: Unknown1
  - name: Card2
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
        name: 'Card1',
        count: 1,
        frontTemplate: 'Front1',
        backTemplate: 'Back1',
        customOption: 'Unknown1',
      },
      {
        name: 'Card2',
        count: 2,
        frontTemplate: 'Front2',
        backTemplate: 'Back2',
        customOption: 'Unknown2',
      },
    ];
    Cards.findFactory(<Arguements>{}, <DeckConfig>{ cardsParser: 'yaml' })
      .then((factory) =>
        factory(<Arguements>{}, <DeckConfig>{ list: 'fake/path.yaml' }),
      )
      .then((testSubject) => {
        testSubject.cards$.subscribe((cards) => {
          expect(cards).toEqual(expectedCards);
          done();
        });
      });
  });
});
