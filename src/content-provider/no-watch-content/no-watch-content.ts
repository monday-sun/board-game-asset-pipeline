import fs from 'fs';
import { from } from 'rxjs';
import util from 'util';
import { FileContent } from '..';

const readFile = util.promisify(fs.readFile);

class NoWatchContent implements FileContent {
  content$ = from(readFile(this.filePath, 'utf8'));
  constructor(private filePath: string) {}
}

export function createContentProvider(filePath: string) {
  const fileWatcher = new NoWatchContent(filePath);
  return fileWatcher;
}
