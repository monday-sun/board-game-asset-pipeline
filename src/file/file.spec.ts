import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { BehaviorSubject, delay, toArray } from 'rxjs';
import { File } from './file';

describe('File', () => {
  let endWatch$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    jest.clearAllMocks();
    endWatch$ = new BehaviorSubject<boolean>(false);
    await fsPromises.writeFile(path.join(process.cwd(), 'file1'), 'test');
  });

  afterEach(async () => {
    await fsPromises.rm(path.join(process.cwd(), 'file1'));
  });

  it('should emit once when watch is false, not call watch, and complete', (done) => {
    const watchSpy = jest.spyOn(fsPromises, 'watch');
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

  it('should emit once when watch is true and call watch', (done) => {
    const watchSpy = jest.spyOn(fs, 'watch');

    const expectedEmits = [
      { filePath: 'file1', relativePath: path.join(process.cwd(), 'file1') },
    ];

    const file$ = File.factory(
      { watch: true } as any,
      'file1',
      // delay is needed to prevent the test from completing before the watch event is emitted
      // other test don't have this problem because they're writing the file too
      endWatch$.pipe(delay(2000)),
    );

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

  it('should emit twice when watching and file changes', (done) => {
    const watchSpy = jest.spyOn(fs, 'watch');

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

    fsPromises
      .writeFile(path.join(process.cwd(), 'file1'), 'test')
      .then(() => endWatch$.next(true));
  });

  it('should watch once with multiple subscribers', (done) => {
    const watchSpy = jest.spyOn(fs, 'watch');

    const expectedEmits = [
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

    fsPromises
      .writeFile(path.join(process.cwd(), 'file1'), 'test')
      .then(() => endWatch$.next(true));
  });
});
