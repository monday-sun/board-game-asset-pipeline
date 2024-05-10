import fsPromises from 'fs/promises';
import path from 'path';
import { Observable, from, map, merge, of } from 'rxjs';
import { Arguements } from '../types';

export type Paths = {
  filePath: string;
  relativePath: string;
};
export interface File {
  path$: Observable<Paths>;
}

export type FileFactory = (args: Arguements, filePath: string) => File;

export namespace File {
  export const factory: FileFactory = (
    args: Arguements,
    filePath: string,
  ): File => {
    const relativePath = path.join(process.cwd(), filePath);

    let path$ = of({
      filePath,
      relativePath,
    });

    if (args.watch) {
      path$ = merge(
        path$,
        from(fsPromises.watch(relativePath)).pipe(
          map(() => ({
            filePath,
            relativePath,
          })),
        ),
      );
    }
    return <File>{ path$ };
  };
}
