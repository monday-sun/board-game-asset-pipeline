import fsPromises from 'fs/promises';
import { of, throwError } from 'rxjs';
import { Arguements } from '../types';
import { File } from './file';
import { FileContent } from './file-content';

jest.mock('fs/promises');
jest.mock('./file');

describe('FileContent', () => {
  it('reads when file change is observed', (done) => {
    const mockObserve = File.observe as jest.Mock;
    mockObserve.mockReturnValueOnce(of({ filePath: 'file1' }));

    const mockReadFile = fsPromises.readFile as jest.Mock;
    mockReadFile.mockResolvedValueOnce('file content');

    const fileContent = FileContent.observe(<Arguements>{}, 'file1');
    fileContent.content$.subscribe((content) => {
      expect(content).toEqual({ filePath: 'file1', content: 'file content' });
      done();
    });
  });

  it('reads when file change is observed', (done) => {
    const mockObserve = File.observe as jest.Mock;
    mockObserve.mockReturnValueOnce(throwError(() => 'test error'));

    const fileContent = FileContent.observe(<Arguements>{}, 'file1');

    fileContent.content$.subscribe({
      error: (error) => {
        expect(error).toEqual('test error');
        done();
      },
    });
  });
});
