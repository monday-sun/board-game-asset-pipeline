import '@testing-library/jest-dom';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { ReactToHtml } from './react-to-html';

jest.mock('react-dom/server', () => ({ renderToString: jest.fn() }));

describe('ReactToHtml', () => {
  it('should render component to static HTML', async () => {
    const componentPath = './path/to/component';
    const props = { prop1: 'value1', prop2: 'value2' };
    const mockComponent = () => <div>Mock Component</div>;
    const mockRenderToString = '<div>Mock Component</div>';

    jest.mock('./path/to/component', () => mockComponent, { virtual: true });
    (renderToString as jest.Mock).mockReturnValue(mockRenderToString);

    const reactToHtml = new ReactToHtml();
    const result = await reactToHtml.convertToStaticHtml(componentPath, props);

    expect(result).toBe(mockRenderToString);
  });
});