import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const [templatePath, dataString] = process.argv.slice(2);
const data = JSON.parse(dataString);

import(`${templatePath}`).then(({ default: Component }) => {
  const html = renderToStaticMarkup(React.createElement(Component, data));
  process.stdout.write(html);
});
