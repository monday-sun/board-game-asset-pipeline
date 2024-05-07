import fsPromises from 'fs/promises';
import { File } from './file';

jest.mock('fs/promises');

describe('File', () => {
  it('should emit once when watch is false and not call watch', (done) => {
    const mockWatch = fsPromises.watch as jest.Mock;

    const expectedEmits = [{ filePath: 'file1' }];
    const file$ = File.factory({ watch: false } as any, 'file1');
    file$.subscribe((file) => {
      expect(mockWatch).not.toHaveBeenCalled();
      expect(file).toEqual(expectedEmits.shift());
      if (expectedEmits.length === 0) {
        done();
      }
    });
  });

  it('should emit once when watch is true and call watch', (done) => {
    const mockWatch = fsPromises.watch as jest.Mock;
    mockWatch.mockReturnValue(new Promise(() => {}));

    const expectedEmits = [{ filePath: 'file1' }];
    const file$ = File.factory({ watch: true } as any, 'file1');
    file$.subscribe((file) => {
      expect(file).toEqual(expectedEmits.shift());
      if (expectedEmits.length === 0) {
        done();
      }
    });
  });

  it('should emit twice when watching and file changes', (done) => {
    const mockWatch = fsPromises.watch as jest.Mock;
    mockWatch.mockReturnValue(Promise.resolve('change'));

    const expectedEmits = [{ filePath: 'file1' }, { filePath: 'file1' }];
    const file$ = File.factory({ watch: true } as any, 'file1');
    file$.subscribe((file) => {
      expect(file).toEqual(expectedEmits.shift());
      if (expectedEmits.length === 0) {
        done();
      }
    });
  });
});
