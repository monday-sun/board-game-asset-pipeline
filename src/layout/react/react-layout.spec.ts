import { of } from 'rxjs';
import { LayoutResult } from '..';
import { DeckConfig } from '../../config';
import { Paths } from '../../file/file';
import { NeedsLayout } from '../../templates';
import { Arguements } from '../../types';
import { factory } from './react-layout';

describe('ReactLayout', () => {
  it('should render all requested layouts in process', (done) => {
    const testSubject = factory(
      <Arguements>{},
      <DeckConfig>{},
      {
        needsLayout$: of(
          ...[
            <NeedsLayout>{
              templatePaths: <Paths>{
                filePath: './test/test-component',
                relativePath: './test/test-component',
              },
              card: {
                message: 'Goodbye!',
              } as any,
            },
            <NeedsLayout>{
              templatePaths: <Paths>{
                filePath: './test/test-component',
                relativePath: './test/test-component',
              },
              card: {
                message: 'Hello!',
              } as any,
            },
          ],
        ),
      },
      'react-render/test/fake-react-render',
    );

    const expectedLayouts = [
      {
        templatePaths: <Paths>{
          filePath: './test/test-component',
          relativePath: './test/test-component',
        },
        card: {
          message: 'Goodbye!',
        },
        layout: '<div>Goodbye!</div>',
        format: 'html',
      },
      {
        templatePaths: <Paths>{
          filePath: './test/test-component',
          relativePath: './test/test-component',
        },
        card: {
          message: 'Hello!',
        },
        layout: '<div>Hello!</div>',
        format: 'html',
      },
    ];

    testSubject.layout$.subscribe((layout) => {
      expect(layout).toEqual(expectedLayouts.shift());
      if (expectedLayouts.length === 0) {
        done();
      }
    });
  });

  it('should render all requested layouts out of process', (done) => {
    const testSubject = factory(
      <Arguements>{ watch: true },
      <DeckConfig>{},
      {
        needsLayout$: of(
          ...[
            <NeedsLayout>{
              templatePaths: <Paths>{
                filePath: './test/test-component',
                relativePath: './test/test-component',
              },
              card: {
                message: 'Goodbye!',
              } as any,
            },
            <NeedsLayout>{
              templatePaths: <Paths>{
                filePath: './test/test-component',
                relativePath: './test/test-component',
              },
              card: {
                message: 'Hello!',
              } as any,
            },
          ],
        ),
      },
      'react-render/test/fake-react-render',
    );

    const expectedLayouts = [
      <LayoutResult>{
        templatePaths: <Paths>{
          filePath: './test/test-component',
          relativePath: './test/test-component',
        },
        card: {
          message: 'Goodbye!',
        } as any,
        layout: '<div>Goodbye!</div>',
        format: 'html',
      },
      <LayoutResult>{
        templatePaths: <Paths>{
          filePath: './test/test-component',
          relativePath: './test/test-component',
        },
        card: {
          message: 'Hello!',
        } as any,
        layout: '<div>Hello!</div>',
        format: 'html',
      },
    ];

    testSubject.layout$.subscribe((layout) => {
      const layoutIndex = expectedLayouts.findIndex((expected) => {
        console.log(expected, layout);
        return (
          expected.layout === layout.layout && expected.format === layout.format
        );
      });
      expect(layoutIndex).toBeGreaterThanOrEqual(0);

      expectedLayouts.splice(layoutIndex, 1);
      if (expectedLayouts.length === 0) {
        done();
      }
    });
  });
});
