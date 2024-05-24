import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OperatorFunction, catchError, filter, from, map, mergeMap, of, toArray } from 'rxjs';
import { ReactRender } from '.';
import { Card } from '../../../cards';
import { LayoutResult } from '../..';

export const render: ReactRender = (
  template: string,
  cards: ({
    width?: number | string;
    height?: number | string;
  } & Card)[],
) => {
  return from(import(`${template}`)).pipe(
    mergeMap((template) => cards.map((card) => ({ ...template, card }))),
    map(({ default: Component, card }) => {
      const { width, height } = card;

      const bodyStyle = `body {
        width: ${width || 'fit-content'};
        height: ${height || 'fit-content'};
      }`;
      const layout = renderToStaticMarkup(
        <html>
          <head>
            <style>{bodyStyle}</style>
          </head>
          <body>
            <Component {...card} />
          </body>
        </html>,
      );
      return { template, card, layout, format: 'html' };
    }),
    catchError((error) => {
      console.error(error);
      return of(undefined);
    }),
    filter((layoutResult) => layoutResult !== undefined) as OperatorFunction<
      LayoutResult | undefined,
      LayoutResult
    >,
    map((layoutResult) => ({
      ...layoutResult,
      layout: layoutResult.layout
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g, ' '),
    })),
    toArray(),
  );
};

if (require.main === module) {
  const [templatePath, dataString] = process.argv.slice(2);
  const data = JSON.parse(dataString);
  render(templatePath, data).subscribe((layoutResult) => {
    process.stdout.write(JSON.stringify(layoutResult));
  });
}
