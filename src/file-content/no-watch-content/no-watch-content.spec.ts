import fs from 'fs';
import { create } from './no-watch-content';

jest.mock('fs');

describe('ContentNoWatchProvider', () => {
  let actualReadCallback: (err: any, data: string) => void;
  const mockFsReadFile = fs.readFile as jest.MockedFunction<any>;

  beforeEach(() => {
    mockFsReadFile.mockImplementation(
      (_: any, _1: any, callback: (err: any, data: string) => void) => {
        actualReadCallback = callback;
      },
    );
  });

  it('reads the file once and emits the file content', (done) => {
    const testSubject = create('test.txt');

    testSubject.content$.subscribe({
      next: (data) => {
        expect(data).toBe('file content');
        done();
      },
    });

    actualReadCallback(null, 'file content');
  });
});
