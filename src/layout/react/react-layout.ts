import { Observable, from, map, mergeAll } from 'rxjs';
import { Layout, LayoutFactory, LayoutResult } from '..';
import { Templates } from '../../templates';
import { Arguements } from '../../types';

function executeInThisProcess(
  templatePath: string,
  data: Record<string, string>,
): Promise<string> {
  const { render } = require('./react-render/react-render');
  return render(templatePath, data);
}

function executeInChildProcess(
  templatePath: string,
  data: Record<string, string>,
): Promise<string> {
  const { execFile } = require('child_process');

  return new Promise((resolve, reject) =>
    execFile(
      'node',
      [
        './build/src/layout/react/react-render/react-render',
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
): Promise<string> {
  if (process === 'this') {
    return executeInThisProcess(templatePath, data);
  } else {
    return executeInChildProcess(templatePath, data);
  }
}

export class ReactLayout implements Layout {
  layout$: Observable<LayoutResult>;

  constructor(templates: Templates, process: 'this' | 'child') {
    this.layout$ = templates.needsLayout$.pipe(
      map(({ templatePaths, card }) =>
        from(toHTML(templatePaths.relativePath, card, process)).pipe(
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
  }
}

export const factory: LayoutFactory = (
  args: Arguements,
  templates: Templates,
): Layout => {
  return new ReactLayout(templates, args.watch ? 'child' : 'this');
};
