import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { from, map } from 'rxjs';
import { ReactRender } from '.';

export const render: ReactRender = (templatePath: string, data: any) => {
  return from(import(`${templatePath}`)).pipe(
    map(({ default: Component }) => {
      return renderToStaticMarkup(React.createElement(Component, data));
    }),
  );
};

if (require.main === module) {
  const [templatePath, dataString] = process.argv.slice(2);
  const data = JSON.parse(dataString);
  render(templatePath, data).subscribe((html) => {
    process.stdout.write(html);
  });
}
