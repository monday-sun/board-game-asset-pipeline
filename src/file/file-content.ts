import fsPromises from 'fs/promises';
import {
  Observable,
  distinctUntilChanged,
  from,
  mergeMap,
  shareReplay,
  tap,
} from 'rxjs';
import { Arguments } from '../types';
import { File } from './file';

export type FileContent = Observable<{ filePath: string; content: string }>;

export type FileContentFactory = (args: Arguments, file: File) => FileContent;

export namespace FileContent {
  export const factory: FileContentFactory = (
    args: Arguments,
    file$: File,
  ): FileContent => {
    const content$ = file$.pipe(
      tap(
        ({ relativePath }) =>
          args.verbose && console.log(`Reading ${relativePath}`),
      ),
      mergeMap((file) =>
        from(
          fsPromises
            .readFile(file.relativePath, 'utf8')
            .then((content) => ({ filePath: file.filePath, content })),
        ),
      ),
      shareReplay(),
      distinctUntilChanged(
        ({ content: prevContent }, { content }) => content === prevContent,
      ),
      tap(
        ({ filePath, content }) =>
          args.verbose && console.log(`New ${filePath} contents: ${content}`),
      ),
    );
    return content$;
  };
}
