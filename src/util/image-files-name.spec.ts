import { createImageFileName } from './image-file-name';

describe('createImageFileName', () => {
  it('should create a file name from a card name', () => {
    const fileName = createImageFileName('/output', 'Card Name');
    expect(fileName).toBe('/output/card-name.png');
  });

  it('should create a file name with a card number', () => {
    const fileName = createImageFileName('/output', 'Card Name', 'png', 1);
    expect(fileName).toBe('/output/card-name-1.png');
  });

  it('should create a file name with a different format', () => {
    const fileName = createImageFileName('/output', 'Card Name', 'jpg');
    expect(fileName).toBe('/output/card-name.jpg');
  });

  it('should create a file name with a suffix', () => {
    const fileName = createImageFileName('/output', 'Card Name', 'png', -1, 'suffix');
    expect(fileName).toBe('/output/card-name-suffix.png');
  });

  it('should create a file name with a card number and a suffix', () => {
    const fileName = createImageFileName('/output', 'Card Name', 'png', 1, 'suffix');
    expect(fileName).toBe('/output/card-name-suffix-1.png');
  });
});