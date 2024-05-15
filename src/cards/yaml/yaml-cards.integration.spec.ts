import { of } from 'rxjs';
import { Cards } from '..';
import { DeckConfig } from '../../config';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';

jest.mock('../../file/file-content');
describe('Yaml', () => {
  it('parses cards from a yaml file', (done) => {
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

    const content: FileContent = {
      content$: of({ filePath: '', content: yaml }),
    };

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
        data: {
          customOption: 'Unknown1',
        },
      },
      {
        name: 'card-2',
        count: 2,
        frontTemplate: 'Front2',
        backTemplate: 'Back2',
        data: {
          customOption: 'Unknown2',
        },
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

  it('parses cards from a yaml file', (done) => {
    const yaml = `
cards:
  card-1:
    count: 1
    frontTemplate: Front1
    customOption: Unknown1
  card-2:
    count: 2
    frontTemplate: Front2
    customOption: Unknown2
`;

    const content: FileContent = {
      content$: of({ filePath: '', content: yaml }),
    };

    const mockContentFactory = FileContent.factory as jest.MockedFunction<
      typeof FileContent.factory
    >;
    mockContentFactory.mockReturnValue(content);

    const expectedCards = [
      {
        name: 'card-1',
        count: 1,
        frontTemplate: 'Front1',
        data: {
          customOption: 'Unknown1',
        },
      },
      {
        name: 'card-2',
        count: 2,
        frontTemplate: 'Front2',
        data: {
          customOption: 'Unknown2',
        },
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
