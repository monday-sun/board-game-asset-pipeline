import { cwd } from 'process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Arguements, LayoutRenderer } from '../../types';

export class ReactLayoutRenderer implements LayoutRenderer {
  constructor(
    private outputPath: string,
    private debugHtml: boolean = false,
  ) {}

  toHTML(templatePath: string, data: Record<string, string>): Promise<string> {
    return import(`${cwd()}/${templatePath}`).then(({ default: Component }) => {
      return renderToStaticMarkup(<Component {...data} />);
    });
  }
}

export function createLayoutRenderer(args: Arguements): LayoutRenderer {
  return new ReactLayoutRenderer(args.outputDir, args.debugHtml);
}
