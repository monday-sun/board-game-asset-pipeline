import { Observable } from 'rxjs';
import { Arguements } from '../types';

export interface FileContent {
  content$: Observable<string>;
}

export namespace FileContent {
  export const factory = (args: Arguements): Promise<FileContent> => {
    return (
      args.watch
        ? import('./watch-content/watch-content')
        : import('./no-watch-content/no-watch-content')
    ).then(({ create }) => create(args.cardList));
  };
}
