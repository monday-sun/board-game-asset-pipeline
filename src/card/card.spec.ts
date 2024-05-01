import { LayoutRenderer } from '../types';
import { Card } from './card';

describe('Card', () => {
  let mockLayoutRenderer: LayoutRenderer;

  beforeEach(() => {
    mockLayoutRenderer = {
      toHTML: jest.fn((template, props) =>
        Promise.resolve(template + JSON.stringify(props)),
      ),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a Card from CardInfo', () => {
    const cardInfo = {
      name: 'Card1',
      count: '1',
      frontTemplate: 'Front1',
      backTemplate: 'Back1',
      unknown: 'Unknown1',
    };
    const card = Card.from(cardInfo, mockLayoutRenderer);
    expect(card).toBeInstanceOf(Card);
    expect(card.name).toBe('Card1');
    expect(card.count).toBe('1');
    expect(card.frontTemplate).toBe('Front1');
    expect(card.backTemplate).toBe('Back1');
    expect(card.data).toEqual(cardInfo);
  });

  it('should convert a Card to HTML', async () => {
    const cardInfo = {
      name: 'Card1',
      count: '1',
      frontTemplate: 'Front1',
      backTemplate: 'Back1',
      unknown: 'Unknown1',
    };

    const card = Card.from(cardInfo, mockLayoutRenderer);
    const html = await card.toHtml();
    expect(html).toEqual({
      frontHtml: `Front1${JSON.stringify(cardInfo)}`,
      backHtml: `Back1${JSON.stringify(cardInfo)}`,
    });
  });
});
