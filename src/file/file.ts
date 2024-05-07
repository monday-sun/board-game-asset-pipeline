import fsPromises from 'fs/promises';
import { Observable, from, map, merge, of } from 'rxjs';
import { Arguements } from '../types';

export interface File {
  filePath: string;
}

export namespace File {
  export function observe(
    args: Arguements,
    filePath: string,
  ): Observable<File> {
    const file = <File>{ filePath };
    let observable = of(file);
    if (args.watch) {
      observable = merge(
        observable,
        from(fsPromises.watch(filePath)).pipe(map((event) => file)),
      );
    }
    return observable;
  }
}
