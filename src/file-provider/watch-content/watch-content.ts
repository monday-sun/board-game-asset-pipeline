import fs from 'fs';
import { Subject } from 'rxjs';
import { FileProvider } from '../../types';

class WatchContent implements FileProvider {
  private subject = new Subject<string>();

  constructor() {}

  startWatch(filePath: string) {
    fs.watch(filePath, (eventType, filename) => {
      if (eventType === 'change') {
        this.updateStream(filePath);
      }
    });
  }

  private updateStream(filePath: string) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        this.subject.next(data);
      }
    });
  }

  stream() {
    return this.subject.asObservable();
  }
}

export function createFileProvider(filePath: string) {
  const fileWatcher = new WatchContent();
  fileWatcher.startWatch(filePath);
  return fileWatcher;
}
