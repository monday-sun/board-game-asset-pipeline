import fsPromises from 'fs/promises';
import { of, throwError } from 'rxjs';
import { Arguements } from '../types';
import { FileContent } from './file-content';

jest.mock('fs/promises');

describe('FileContent', () => {
  it('reads when file change is observed', (done) => {
    const mockReadFile = fsPromises.readFile as jest.Mock;
    mockReadFile.mockResolvedValueOnce('file content');

    const fileContent = FileContent.factory(<Arguements>{}, {
      path$: of('file1'),
    });
    fileContent.content$.subscribe((content) => {
      expect(content).toEqual({ filePath: 'file1', content: 'file content' });
      done();
    });
  });

  it('reads when file change is observed', (done) => {
    const fileContent = FileContent.factory(<Arguements>{}, {
      path$: throwError(() => 'test error'),
    });

    fileContent.content$.subscribe({
      error: (error) => {
        expect(error).toEqual('test error');
        done();
      },
    });
  });
});
