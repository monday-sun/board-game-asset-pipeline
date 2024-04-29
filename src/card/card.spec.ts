import { Card } from './card';

jest.mock('./react-to-html', () => ({
  convertToStaticHtml: jest.fn((template, props) => Promise.resolve(template + JSON.stringify(props)))
}));

describe('Card', () => {
  it('should create a Card from CardInfo', () => {
    const cardInfo = { name: 'Card1', count: '1', frontTemplate: 'Front1', backTemplate: 'Back1', unknown: 'Unknown1' };
    const card = Card.from(cardInfo);
    expect(card).toBeInstanceOf(Card);
    expect(card.name).toBe('Card1');
    expect(card.count).toBe('1');
    expect(card.frontTemplate).toBe('Front1');
    expect(card.backTemplate).toBe('Back1');
    expect(card.unknownValues).toEqual({ unknown: 'Unknown1' });
  });

  it('should convert a Card to HTML', async () => {
    const cardInfo = { name: 'Card1', count: '1', frontTemplate: 'Front1', backTemplate: 'Back1', unknown: 'Unknown1' };
    const card = Card.from(cardInfo);
    const html = await card.toHtml();
    expect(html).toEqual(['Front1{"unknown":"Unknown1"}', 'Back1{"unknown":"Unknown1"}']);
  });
});