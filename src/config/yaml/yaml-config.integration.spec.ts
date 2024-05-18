import { of } from 'rxjs';
import { Deck } from '..';
import { FileContent } from '../../file/file-content';
import { Arguments } from '../../types';

jest.mock('../../file/file-content');
jest.mock('../../file/file');

describe('PapaParseCards', () => {
  it('parses cards from a CSV file', (done) => {
    const yaml = `
decks:
  - cardsParser: yaml
    list: deck-name/deck.yml
    layout: react
    outputDir: generated/items
    output:
      - renderer: raw
      - renderer: nodeIndividual
  - cardsParser: csv
    list: deck-name/deck.csv
    layout: react
    outputDir: generated/items
    output:
      - renderer: raw
`;

    const content: FileContent = of({ filePath: '', content: yaml });

    const mockContentFactory = FileContent.factory as jest.MockedFunction<
      typeof FileContent.factory
    >;
    mockContentFactory.mockReturnValue(content);

    const expectedDecks = [
      <Deck>{
        cardsParser: 'yaml',
        list: 'deck-name/deck.yml',
        layout: 'react',
        outputDir: 'generated/items',
        output: [
          { renderer: 'raw', rootOutputDir: 'generated/items' },
          { renderer: 'nodeIndividual', rootOutputDir: 'generated/items' },
        ],
      },
      <Deck>{
        cardsParser: 'csv',
        list: 'deck-name/deck.csv',
        layout: 'react',
        outputDir: 'generated/items',
        output: [{ renderer: 'raw', rootOutputDir: 'generated/items' }],
      },
    ];
    Deck.factory(<Arguments>{}).subscribe((decks) => {
      const expectedDeck = expectedDecks.shift();
      expect(decks).toEqual(expectedDeck);
      if (expectedDecks.length === 0) {
        done();
      }
    });
  });
});
