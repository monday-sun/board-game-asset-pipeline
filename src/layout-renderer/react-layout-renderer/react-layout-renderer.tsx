import { cwd } from 'process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LayoutRenderer } from '../../types';

export async function convertToStaticHtml(
  componentPath: string,
  props: Record<string, any> = {},
): Promise<string> {
  const { default: Component } = await import(`${cwd()}/${componentPath}`);
  return renderToStaticMarkup(<Component {...props} />);
}

export class ReactLayoutRenderer implements LayoutRenderer {
  toHTML(templatePath: string, data: Record<string, string>): Promise<string> {
    return convertToStaticHtml(templatePath, data);
  }
}

export const layoutRenderer = new ReactLayoutRenderer();
