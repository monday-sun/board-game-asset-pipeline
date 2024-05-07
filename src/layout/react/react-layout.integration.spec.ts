import { of } from 'rxjs';
import { Paths } from '../../file/file';
import { NeedsLayout } from '../../templates';
import { factory } from './react-layout';

describe('ReactLayout', () => {
  it('should render a React component to static HTML with properties', (done) => {
    const testSubject = factory({} as any, {
      needsLayout$: of(<NeedsLayout>{
        templatePaths: <Paths>{
          filePath: './test-component',
          relativePath: './test-component',
        },
        card: {
          message: 'Hello, world!',
        } as any,
      }),
    });

    testSubject.layout$.subscribe((layout) => {
      expect(layout).toEqual({
        templatePaths: <Paths>{
          filePath: './test-component',
          relativePath: './test-component',
        },
        card: {
          message: 'Hello, world!',
        },
        layout: '<div>Hello, world!</div>',
        format: 'html',
      });
      done();
    });
  });
});
