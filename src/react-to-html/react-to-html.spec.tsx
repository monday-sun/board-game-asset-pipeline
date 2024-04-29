import '@testing-library/jest-dom';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { convertToStaticHtml } from './react-to-html';

jest.mock('react-dom/server', () => ({ renderToString: jest.fn() }));

class TestComponent extends React.Component<{ name: string }> {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

describe('ReactToHtml', () => {
  it('should render component to static HTML', async () => {
    const componentPath = './path/to/component';
    const props = { name: 'test_name' };
    const mockRenderToString = '<div>Mock Component</div>';

    jest.mock('./path/to/component', () => TestComponent, { virtual: true });

    (renderToString as jest.Mock).mockReturnValue(mockRenderToString);

    const result = await convertToStaticHtml(componentPath, props);

    expect(result).toBe(mockRenderToString);
    expect(renderToString).toHaveBeenCalledWith(
      <TestComponent name="test_name" />,
    );
  });
});
