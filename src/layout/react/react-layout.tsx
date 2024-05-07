import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Observable, from, map, mergeAll } from 'rxjs';
import { Layout, LayoutFactory, LayoutResult } from '..';
import { Templates } from '../../templates';
import { Arguements } from '../../types';

function toHTML(
  templatePath: string,
  data: Record<string, string>,
): Promise<string> {
  return import(`${templatePath}`).then(({ default: Component }) => {
    return renderToStaticMarkup(<Component {...data} />);
  });
}

export class ReactLayout implements Layout {
  layout$: Observable<LayoutResult>;

  constructor(templates: Templates) {
    this.layout$ = templates.needsLayout$.pipe(
      map(({ templatePaths, card }) =>
        from(toHTML(templatePaths.relativePath, card)).pipe(
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
  return new ReactLayout(templates);
};
