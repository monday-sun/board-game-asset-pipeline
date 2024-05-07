import fs from 'fs';
import { Subject } from 'rxjs';
import { FileContent } from '..';

class WatchContent implements FileContent {
  private contentSubject = new Subject<string>();
  content$ = this.contentSubject.asObservable();

  constructor() {}

  startWatch(filePath: string) {
    fs.watch(filePath, (eventType, filename) => {
      if (eventType === 'change') {
        this.updateContent(filePath);
      }
    });
    this.updateContent(filePath);
  }

  private updateContent(filePath: string) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        this.contentSubject.next(data);
      }
    });
  }
}

export function createContentProvider(filePath: string) {
  const fileWatcher = new WatchContent();
  fileWatcher.startWatch(filePath);
  return fileWatcher;
}
