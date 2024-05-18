import fsPromises from 'fs/promises';
import { Observable, from, switchMap } from 'rxjs';
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
      switchMap((file) =>
        from(
          fsPromises
            .readFile(file.relativePath, 'utf8')
            .then((content) => ({ filePath: file.filePath, content })),
        ),
      ),
    );
    return content$;
  };
}
