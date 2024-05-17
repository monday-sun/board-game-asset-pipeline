import { Observable, from, map, mergeAll } from 'rxjs';
import { LayoutFactory, LayoutResult } from '..';
import { Deck } from '../../config';
import { NeedsLayout } from '../../templates';
import { Arguements } from '../../types';

function executeInThisProcess(
  templatePath: string,
  data: Record<string, string>,
  renderPath: string,
): Promise<string> {
  const { render } = require('./react-render/' + renderPath);
  return render(templatePath, data);
}

function executeInChildProcess(
  templatePath: string,
  data: Record<string, string>,
  renderPath: string,
): Promise<string> {
  const { execFile } = require('child_process');

  return new Promise((resolve, reject) =>
    execFile(
      'ts-node',
      [
        './src/layout/react/react-render/' + renderPath,
        templatePath,
        JSON.stringify(data),
      ],
      (error: Error, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      },
    ),
  );
}

function toHTML(
  templatePath: string,
  data: Record<string, string>,
  process: 'this' | 'child',
  renderPath: string,
): Promise<string> {
  if (process === 'this') {
    return executeInThisProcess(templatePath, data, renderPath);
  } else {
    return executeInChildProcess(templatePath, data, renderPath);
  }
}

export const factory: LayoutFactory = (
  args: Arguements,
  _: Deck,
  templates$: Observable<NeedsLayout>,
): Observable<LayoutResult> => {
  return templates$.pipe(
    map(({ templatePaths, card }) =>
      from(
        toHTML(
          templatePaths.relativePath,
          card,
          args.watch ? 'child' : 'this',
          args.test ? 'test/fake-react-render' : 'react-render',
        ),
      ).pipe(
        map((layout) => ({
          templatePaths,
          card,
          layout,
          format: 'html',
        })),
      ),
    ),
    mergeAll(),
  );
};
