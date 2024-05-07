import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Observable, from, switchMap } from 'rxjs';
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
      switchMap(({ templatePath, card }) =>
        from(
          toHTML(templatePath, card).then((layout) => ({
            templatePath,
            card,
            layout,
            format: 'html',
          })),
        ),
      ),
    );
  }
}

export const factory: LayoutFactory = (
  args: Arguements,
  templates: Templates,
): Layout => {
  return new ReactLayout(templates);
};
