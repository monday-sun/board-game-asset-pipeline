import fsPromises from 'fs/promises';
import { Observable, from, map, merge, of } from 'rxjs';
import { Arguements } from '../types';

export interface File {
  path$: Observable<string>;
}

export type FileFactory = (args: Arguements, filePath: string) => File;

export namespace File {
  export const factory: FileFactory = (
    args: Arguements,
    filePath: string,
  ): File => {
    let path$ = of(filePath);
    if (args.watch) {
      path$ = merge(
        path$,
        from(fsPromises.watch(filePath)).pipe(map((event) => filePath)),
      );
    }
    return <File>{ path$ };
  };
}
