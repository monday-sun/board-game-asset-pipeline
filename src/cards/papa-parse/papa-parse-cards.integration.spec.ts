import { of } from 'rxjs';
import { Cards } from '..';
import { DeckConfig } from '../../config';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';

jest.mock('../../file/file-content');
describe('PapaParseCards', () => {
  it('parses cards from a CSV file', (done) => {
    const csvContent = `name,count,frontTemplate,backTemplate,customOption
Card1,1,Front1,Back1,Unknown1
Card2,2,Front2,Back2,Unknown2`;

    const content: FileContent = {
      content$: of({ filePath: '', content: csvContent }),
    };

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
        data: {
          customOption: 'Unknown1',
        },
      },
      {
        name: 'Card2',
        count: 2,
        frontTemplate: 'Front2',
        backTemplate: 'Back2',
        data: {
          customOption: 'Unknown2',
        },
      },
    ];
    Cards.findFactory(<Arguements>{}, <DeckConfig>{ cardsParser: 'papaparse' })
      .then((factory) =>
        factory(<Arguements>{}, <DeckConfig>{ list: 'fake/path.csv' }),
      )
      .then((testSubject) => {
        testSubject.cards$.subscribe((cards) => {
          expect(cards).toEqual(expectedCards);
          done();
        });
      });
  });

  it('handles no backTemplate', (done) => {
      const csvContent = `name,count,frontTemplate,customOption
Card1,1,Front1,Unknown1
Card2,2,Front2,Unknown2`;

      const content: FileContent = {
        content$: of({ filePath: '', content: csvContent }),
      };

      const mockContentFactory = FileContent.factory as jest.MockedFunction<
        typeof FileContent.factory
      >;
      mockContentFactory.mockReturnValue(content);

      const expectedCards = [
        {
          name: 'Card1',
          count: 1,
          frontTemplate: 'Front1',
          data: {
            customOption: 'Unknown1',
          },
        },
        {
          name: 'Card2',
          count: 2,
          frontTemplate: 'Front2',
          data: {
            customOption: 'Unknown2',
          },
        },
      ];
      Cards.findFactory(
        <Arguements>{},
        <DeckConfig>{ cardsParser: 'papaparse' },
      )
        .then((factory) =>
          factory(<Arguements>{}, <DeckConfig>{ list: 'fake/path.csv' }),
        )
        .then((testSubject) => {
          testSubject.cards$.subscribe((cards) => {
            expect(cards).toEqual(expectedCards);
            done();
          });
        });
    });
});
