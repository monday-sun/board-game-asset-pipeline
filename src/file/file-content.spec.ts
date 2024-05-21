import fsPromises from 'fs/promises';
import path from 'path';
import { of } from 'rxjs';
import { Arguments } from '../types';
import { FileContent } from './file-content';
describe('FileContent', () => {
  const paths = {
    filePath: 'file1',
    relativePath: path.join(process.cwd(), 'file1'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await fsPromises.writeFile(paths.relativePath, 'test');
  });

  afterEach(async () => {
    await fsPromises.rm(paths.relativePath);
  });

  it('reads when file change is observed', (done) => {
    const readSpy = jest.spyOn(fsPromises, 'readFile');
    const fileContent$ = FileContent.factory(<Arguments>{}, of(paths));

    let count = 0;
    fileContent$.subscribe({
      next: (content) => {
        expect(content).toEqual({ filePath: paths.filePath, content: 'test' });
        count++;
      },
      complete: () => {
        expect(count).toEqual(1);
        expect(readSpy).toHaveBeenCalledWith(paths.relativePath, 'utf8');
        expect(readSpy).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });

  it('drops unchanged content', (done) => {
    const readSpy = jest.spyOn(fsPromises, 'readFile');
    const fileContent$ = FileContent.factory(<Arguments>{}, of(paths, paths));

    let count = 0;
    fileContent$.subscribe({
      next: (content) => {
        expect(content).toEqual({ filePath: paths.filePath, content: 'test' });
        count++;
      },
      complete: () => {
        expect(count).toEqual(1);
        expect(readSpy).toHaveBeenCalledTimes(2);
        done();
      },
    });
  });

  it('does not re-read on re-subscription', (done) => {
    const readSpy = jest.spyOn(fsPromises, 'readFile');
    const fileContent$ = FileContent.factory(<Arguments>{}, of(paths));

    let count = 0;
    fileContent$.subscribe(() => {});
    fileContent$.subscribe({
      next: (content) => {
        expect(content).toEqual({ filePath: paths.filePath, content: 'test' });
        count++;
      },
      complete: () => {
        expect(count).toEqual(1);
        expect(readSpy).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });
});
