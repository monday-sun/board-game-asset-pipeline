import fs from 'fs';
import path from 'path';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  from,
  map,
  of,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { Arguments } from '../types';

export type Paths = {
  filePath: string;
  relativePath: string;
};
export type File = Observable<Paths>;

export type FileFactory = (
  args: Arguments,
  filePath: string,
  endWatch$: Observable<boolean>,
) => File;

export namespace File {
  export const factory: FileFactory = (
    args: Arguments,
    filePath: string,
    endWatch$: Observable<boolean>,
  ): File => {
    const relativePath = path.join(process.cwd(), filePath);
    const paths = {
      filePath,
      relativePath,
    };

    let path$ = of(paths);

    if (args.watch) {

      const ac = new AbortController();
      endWatch$ = endWatch$.pipe(
        filter((endWatch) => !!endWatch),
        take(1),
        tap(() => ac.abort()),
        catchError(() => of(true)),
      );

      const watchSubject = new BehaviorSubject<fs.WatchEventType | null>(null);

      fs.watch(
        relativePath,
        { signal: ac.signal },
        (eventType: fs.WatchEventType) => {
          watchSubject.next(eventType);
        },
      );

      path$ = path$.pipe(
        tap((path) => args.verbose && console.log('Watching', path)),
        switchMap(() => watchSubject),
        filter((eventType) => eventType === 'change'),
        tap((info) => args.verbose && console.log('Watch info:', info)),
        map(() => paths),
        shareReplay(),
        takeUntil(endWatch$),
      );
    }

    path$ = path$.pipe(
      tap(
        ({ filePath, relativePath }) =>
          args.verbose && console.log(`Update ${filePath} at ${relativePath}`),
      ),
    );

    return path$;
  };
}
