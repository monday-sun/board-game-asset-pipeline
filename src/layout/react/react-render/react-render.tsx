import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { from, map } from 'rxjs';
import { ReactRender } from '.';
import { Card } from '../../../cards';

export const render: ReactRender = (
  template: string,
  card: {
    width?: number | string;
    height?: number | string;
  } & Card,
) => {
  return from(import(`${template}`)).pipe(
    map(({ default: Component }) => {
      const { width, height } = card;

      const bodyStyle = `body {
        width: ${width || 'fit-content'};
        height: ${height || 'fit-content'};
      }`;
      return renderToStaticMarkup(
        <html>
          <head>
            <style>{bodyStyle}</style>
          </head>
          <body>
            <Component {...card} />
          </body>
        </html>,
      );
    }),
    map((html) => html.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ')),
    map((layout) => ({ template, card, layout, format: 'html' })),
  );
};

if (require.main === module) {
  const [templatePath, dataString] = process.argv.slice(2);
  const data = JSON.parse(dataString);
  render(templatePath, data).subscribe((layoutResult) => {
    process.stdout.write(JSON.stringify(layoutResult));
  });
}
