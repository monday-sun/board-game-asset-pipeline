import { createImageFileName } from './output-file-name';

describe('createImageFileName', () => {
  it('should create a file name from a card name', () => {
    const fileName = createImageFileName({
      outputPath: '/output',
      cardName: 'Card Name',
    });
    expect(fileName).toBe('/output/card-name.png');
  });

  it('should create a file name with a card number', () => {
    const fileName = createImageFileName({
      outputPath: '/output',
      cardName: 'Card Name',
      cardNumber: 1,
    });
    expect(fileName).toBe('/output/card-name-1.png');
  });

  it('should create a file name with a different format', () => {
    const fileName = createImageFileName({
      outputPath: '/output',
      cardName: 'Card Name',
      format: 'jpg',
    });
    expect(fileName).toBe('/output/card-name.jpg');
  });

  it('should create a file name with a suffix', () => {
    const fileName = createImageFileName({
      outputPath: '/output',
      cardName: 'Card Name',
      suffix: 'suffix',
    });
    expect(fileName).toBe('/output/card-name-suffix.png');
  });

  it('should create a file name with a card number and a suffix', () => {
    const fileName = createImageFileName({
      outputPath: '/output',
      cardName: 'Card Name',
      suffix: 'suffix',
      cardNumber: 1,
      format: 'jpg',
    });
    expect(fileName).toBe('/output/card-name-suffix-1.jpg');
  });
});
