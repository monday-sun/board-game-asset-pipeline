import { cwd } from 'process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LayoutRenderer } from '../../types';

export class ReactLayoutRenderer implements LayoutRenderer {
  toHTML(templatePath: string, data: Record<string, string>): Promise<string> {
    return import(`${cwd()}/${templatePath}`).then(({ default: Component }) => {
      return renderToStaticMarkup(<Component {...data} />);
    });
  }
}

export const layoutRenderer = new ReactLayoutRenderer();
