import fsPromises from 'fs/promises';
import path from 'path';
import { Observable, from, map, merge, of } from 'rxjs';
import { Arguments } from '../types';

export type Paths = {
  filePath: string;
  relativePath: string;
};
export type File = Observable<Paths>;

export type FileFactory = (args: Arguments, filePath: string) => File;

export namespace File {
  export const factory: FileFactory = (
    args: Arguments,
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
    return path$;
  };
}
