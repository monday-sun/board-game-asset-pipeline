import fs from 'fs';
import { create } from './watch-content';

jest.mock('fs');

describe('FileContentWatcher', () => {
  let actualWatchCallBack: (eventType: string, filename: string) => void;
  const mockFsWatch = fs.watch as jest.MockedFunction<any>;

  let actualReadCallback: (err: any, data: string) => void;
  const mockFsReadFile = fs.readFile as jest.MockedFunction<any>;

  beforeEach(() => {
    mockFsWatch.mockImplementation(
      (_: string, callback: (eventType: string, filename: string) => void) => {
        actualWatchCallBack = callback as any;
      },
    );

    mockFsReadFile.mockImplementation(
      (_: any, _1: any, callback: (err: any, data: string) => void) => {
        actualReadCallback = callback;
      },
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('watches the file', () => {
    const testSubjest = create('test.txt');
    expect(mockFsWatch).toHaveBeenCalledTimes(1);
    expect(mockFsWatch).toHaveBeenCalledWith('test.txt', expect.any(Function));
  });

  it('updates stream with initial file contents', (done) => {
    const testSubjest = create('test.txt');

    testSubjest.content$.subscribe({
      next: (data) => {
        expect(data).toBe('file content');
        done();
      },
    });
    actualReadCallback(null, 'file content');
  });

  it('reads the file when it changes', () => {
    const testSubjest = create('test.txt');
    actualWatchCallBack('change', 'test.txt');
    expect(mockFsReadFile).toHaveBeenCalledTimes(2);
    expect(mockFsReadFile).toHaveBeenCalledWith(
      'test.txt',
      'utf8',
      expect.any(Function),
    );
  });

  it('updates stream with new file contents', (done) => {
    const testSubjest = create('test.txt');

    testSubjest.content$.subscribe({
      next: (data) => {
        expect(data).toBe('file content');
        done();
      },
    });
    actualWatchCallBack('change', 'test.txt');
    actualReadCallback(null, 'file content');
  });
});
