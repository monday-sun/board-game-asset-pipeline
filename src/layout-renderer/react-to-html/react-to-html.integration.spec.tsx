import { convertToStaticHtml } from './react-to-html';

describe('convertToStaticHtml', () => {
  it('should render a React component to static HTML with properties', async () => {
    const html = await convertToStaticHtml('src/react-to-html/test-component', {
      message: 'Hello, world!',
    });
    expect(html).toBe('<div>Hello, world!</div>');
  });
});
