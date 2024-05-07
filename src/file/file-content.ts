import fsPromises from 'fs/promises';
import { Observable, from, map, mergeMap } from 'rxjs';
import { Arguements } from '../types';
import { File } from './file';

export interface FileContent {
  content$: Observable<{ filePath: string; content: string }>;
}

export namespace FileContent {
  export function observe(args: Arguements, filePath: string): FileContent {
    const content$ = File.observe(args, filePath).pipe(
      mergeMap((file) => from(fsPromises.readFile(file.filePath, 'utf8'))),
      map((content) => ({ filePath, content })),
    );
    return { content$ };
  }
}
