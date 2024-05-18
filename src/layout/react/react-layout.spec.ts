import { of } from 'rxjs';
import { Layout } from '..';
import { Deck } from '../../config';
import { Paths } from '../../file/file';
import { NeedsLayout } from '../../templates';
import { Arguements } from '../../types';
import { factory as testSubject } from './react-layout';

describe('ReactLayout', () => {
  it("completes factory pipeline with 'react' layout", (done) => {
    let defined = false;
    const cardsFactory$ = Layout.findFactory(
      <Arguements>{ test: true },
      <Deck>{ layout: 'react' },
    );
    cardsFactory$.subscribe({
      next: (foundFactory) => {
        expect(foundFactory).toBe(testSubject);
        defined = true;
      },
      complete: () => {
        expect(defined).toBe(true);
        done();
      },
    });
  });

  it('should render all requested layouts', (done) => {
    const layouts$ = testSubject(
      <Arguements>{ test: true },
      <Deck>{},
      of(
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

    layouts$.subscribe((layout) => {
      expect(layout).toEqual(expectedLayouts.shift());
      if (expectedLayouts.length === 0) {
        done();
      }
    });
  });
});
