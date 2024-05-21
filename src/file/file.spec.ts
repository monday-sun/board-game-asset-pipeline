import fs from 'fs';
import path from 'path';
import { BehaviorSubject, toArray } from 'rxjs';
import { File } from './file';

jest.mock('fs');

describe('File', () => {
  let endWatch$: BehaviorSubject<boolean>;
  const watchSpy = jest.spyOn(fs, 'watch');
  let watchCallBack: fs.WatchListener<string>;

  beforeEach(() => {
    jest.clearAllMocks();
    endWatch$ = new BehaviorSubject<boolean>(false);
    watchSpy.mockImplementation(((
      path: string,
      _: fs.WatchOptions,
      cb: fs.WatchListener<string>,
    ) => {
      watchCallBack = cb;
      cb('change', path);
    }) as any);
  });

  it('should emit once when watch is false, not call watch, and complete', (done) => {
    const expectedEmits = [
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
    ];
    const file$ = File.factory({ watch: false } as any, 'file1');
    file$.subscribe({
      next: (file) => {
        expect(watchSpy).not.toHaveBeenCalled();
        expect(file).toEqual(expectedEmits.shift());
      },
      complete: () => {
        expect(expectedEmits.length).toEqual(0);
        done();
      },
    });
  });

  it('should emit twice when watch is true and call watch', (done) => {
    const expectedEmits = [
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
    ];

    const file$ = File.factory({ watch: true } as any, 'file1', endWatch$);

    let checkedFiles = false;
    file$.pipe(toArray()).subscribe({
      next: (files) => {
        expect(files).toEqual(expectedEmits);
        checkedFiles = true;
      },
      complete: () => {
        expect(watchSpy).toHaveBeenCalledTimes(1);
        expect(checkedFiles).toBe(true);
        done();
      },
    });

    endWatch$.next(true);
  });

  it('should emit three times when watching and file changes', (done) => {
    const expectedEmits = [
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
    ];
    const file$ = File.factory({ watch: true } as any, 'file1', endWatch$);

    let checkedFiles = false;
    file$.pipe(toArray()).subscribe({
      next: (files) => {
        expect(files).toEqual(expectedEmits);
        checkedFiles = true;
      },
      complete: () => {
        expect(watchSpy).toHaveBeenCalledTimes(1);
        expect(checkedFiles).toBe(true);
        done();
      },
    });

    watchCallBack('change', 'file1');
    endWatch$.next(true);
  });

  it('should watch once with multiple subscribers', (done) => {
    const expectedEmits = [
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
    ];
    const file$ = File.factory({ watch: true } as any, 'file1', endWatch$);
    file$.subscribe(() => {});

    let checkedFiles = false;
    file$.pipe(toArray()).subscribe({
      next: (files) => {
        expect(files).toEqual(expectedEmits);
        checkedFiles = true;
      },
      complete: () => {
        expect(watchSpy).toHaveBeenCalledTimes(1);
        expect(checkedFiles).toBe(true);
        done();
      },
    });

    watchCallBack('change', 'file1');
    endWatch$.next(true);
  });
});
