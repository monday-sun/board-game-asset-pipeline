import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { from, map } from 'rxjs';
import { ReactRender } from '.';

export const render: ReactRender = (
  templatePath: string,
  data: {
    width?: number | string;
    height?: number | string;
  },
) => {
  return from(import(`${templatePath}`)).pipe(
    map(({ default: Component }) => {
      const { width, height } = data;

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
            <Component {...data} />
          </body>
        </html>,
      );
    }),
  );
};

if (require.main === module) {
  const [templatePath, dataString] = process.argv.slice(2);
  const data = JSON.parse(dataString);
  render(templatePath, data).subscribe((html) => {
    process.stdout.write(
      html.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' '),
    );
  });
}
