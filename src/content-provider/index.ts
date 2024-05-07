import { Observable } from 'rxjs';
import { Arguements } from '../types';

export interface FileContent {
  content$: Observable<string>;
}

export namespace FileContent {
  export function factory(
    args: Arguements,
    filePath: string,
  ): Promise<FileContent> {
    return (
      args.watch
        ? import('./watch-content/watch-content')
        : import('./no-watch-content/no-watch-content')
    ).then(({ create }) => create(filePath));
  }
}
