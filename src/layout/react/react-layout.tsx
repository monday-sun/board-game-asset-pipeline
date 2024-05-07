import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Observable, from, switchMap } from 'rxjs';
import { Layout, LayoutFactory } from '..';
import { Card } from '../../cards';
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
  layout$: Observable<{ templatePath: string; card: Card; layout: string }>;

  constructor(templates: Templates) {
    this.layout$ = templates.needsLayout$.pipe(
      switchMap(({ templatePath, card }) =>
        from(
          toHTML(templatePath, card).then((layout) => ({
            templatePath,
            card,
            layout,
          })),
        ),
      ),
    );
  }

  getFormat(): string {
    return 'html';
  }
}

export const factory: LayoutFactory = (
  args: Arguements,
  templates: Templates,
): Layout => {
  return new ReactLayout(templates);
};
