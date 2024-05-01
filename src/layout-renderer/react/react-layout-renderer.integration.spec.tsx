import { createLayoutRenderer } from './react-layout-renderer';

describe('convertToStaticHtml', () => {
  it('should render a React component to static HTML with properties', async () => {
    const testSubject = createLayoutRenderer();
    const html = await testSubject.toHTML(
      'src/layout-renderer/react/test-component',
      {
        message: 'Hello, world!',
      },
    );
    expect(html).toBe('<div>Hello, world!</div>');
  });
});
