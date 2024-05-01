import { LayoutRenderer } from '../../types';
import { createImageRenderer } from './node-individual-card-image-renderer';

jest.mock('node-html-to-image', () =>
  jest.fn().mockImplementation(({ output }) => Promise.resolve(output)),
);

describe('NodeIndividualCardImageRenderer', () => {
  let layoutRenderer: LayoutRenderer;

  beforeEach(() => {
    layoutRenderer = {
      toHTML: jest.fn((templatePath) => Promise.resolve(templatePath)),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create images for each card', async () => {
    const cardInfos = [
      {
        count: '1',
        name: 'Card 1',
        frontTemplate: 'Front',
        backTemplate: 'Back',
      },
      {
        count: '1',
        name: 'Card 2',
        frontTemplate: 'Front',
        backTemplate: 'Back',
      },
    ];
    const testSubject = createImageRenderer();
    const images = await testSubject.toImages(cardInfos, layoutRenderer);
    expect(images.length).toBe(4);
  });

  it('should create images for each copy of a card', async () => {
    const cardInfos = [
      {
        count: '2',
        name: 'Card 1',
        frontTemplate: 'Front',
        backTemplate: 'Back',
      },
    ];
    const testSubject = createImageRenderer();
    const images = await testSubject.toImages(cardInfos, layoutRenderer);
    expect(images.length).toBe(4);
  });
});
