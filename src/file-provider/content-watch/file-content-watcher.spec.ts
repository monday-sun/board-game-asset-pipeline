import fs from 'fs';
import { createFileProvider } from './file-content-watcher';

jest.mock('fs');

describe('FileContentWatcher', () => {
  let actualWatchCallBack: (eventType: string, filename: string) => void;
  let actualReadCallback: (err: any, data: string) => void;
  let readText = 'file content';
  const mockFsWatch = fs.watch as jest.MockedFunction<any>;
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
    const testSubjest = createFileProvider('test.txt');
    expect(mockFsWatch).toHaveBeenCalledTimes(1);
    expect(mockFsWatch).toHaveBeenCalledWith('test.txt', expect.any(Function));
  });

  it('reads the file when it changes', () => {
    const testSubjest = createFileProvider('test.txt');
    actualWatchCallBack('change', 'test.txt');
    expect(mockFsReadFile).toHaveBeenCalledTimes(1);
    expect(mockFsReadFile).toHaveBeenCalledWith(
      'test.txt',
      'utf8',
      expect.any(Function),
    );
  });

  it('updates stream with new file contents', (done) => {
    const testSubjest = createFileProvider('test.txt');

    testSubjest.stream().subscribe({
      next: (data) => {
        expect(data).toBe('file content');
        done();
      },
    });
    actualWatchCallBack('change', 'test.txt');
    actualReadCallback(null, 'file content');
  });
});
