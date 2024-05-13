import path from 'path';
import { Observable, from, map, mergeAll } from 'rxjs';
import { Layout, LayoutResult } from '..';
import { DeckConfig } from '../../config';
import { Templates } from '../../templates';
import { Arguements } from '../../types';

function relativeRenderPath(renderPath: string): any {
  return path.join(__dirname, renderPath);
}

function executeInThisProcess(
  templatePath: string,
  data: Record<string, string>,
  renderPath: string,
): Promise<string> {
  const { render } = require(relativeRenderPath(renderPath));
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
      [relativeRenderPath(renderPath), templatePath, JSON.stringify(data)],
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

export class ReactLayout implements Layout {
  layout$: Observable<LayoutResult>;

  constructor(
    templates: Templates,
    process: 'this' | 'child',
    renderPath: string,
  ) {
    this.layout$ = templates.needsLayout$.pipe(
      map(({ templatePaths, card }) =>
        from(
          toHTML(templatePaths.relativePath, card, process, renderPath),
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
  }
}

export const factory = (
  args: Arguements,
  _: DeckConfig,
  templates: Templates,
  renderPath: string = 'react-render',
): Layout => {
  return new ReactLayout(templates, args.watch ? 'child' : 'this', renderPath);
};
