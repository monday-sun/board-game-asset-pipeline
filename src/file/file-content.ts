import fsPromises from 'fs/promises';
import { Observable, from, switchMap } from 'rxjs';
import { Arguements } from '../types';
import { File } from './file';

export interface FileContent {
  content$: Observable<{ filePath: string; content: string }>;
}

export type FileContentFactory = (args: Arguements, file: File) => FileContent;

export namespace FileContent {
  export const factory: FileContentFactory = (
    args: Arguements,
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
    return <FileContent>{ content$ };
  };
}
