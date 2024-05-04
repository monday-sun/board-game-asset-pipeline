import fs from 'fs';
import { Observable, from } from 'rxjs';
import util from 'util';
import { ContentProvider } from '..';

const readFile = util.promisify(fs.readFile);

class NoWatchContent implements ContentProvider {
  constructor(private filePath: string) {}

  content(): Observable<string> {
    return from(readFile(this.filePath, 'utf8'));
  }
}

export function createFileProvider(filePath: string) {
  const fileWatcher = new NoWatchContent(filePath);
  return fileWatcher;
}
