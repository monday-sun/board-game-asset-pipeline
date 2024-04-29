import React from 'react';
import { renderToString } from 'react-dom/server';

export class ReactToHtml {
  async convertToStaticHtml(
    componentPath: string,
    props: Record<string, any> = {},
  ): Promise<string> {
    const { default: Component } = await import(componentPath);
    return renderToString(<Component {...props} />);
  }
}
