import { of, tap } from 'rxjs';
import { Layout, LayoutResult } from '..';
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

  it.each([{ watch: true }, { watch: false }])(
    'should render all requested layouts with %p watch',
    ({ watch }, done: jest.DoneCallback) => {
      const layouts$ = testSubject(
        <Arguements>{ test: true, watch },
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

      const actualLayouts: LayoutResult[] = [];
      layouts$.pipe(tap((layout) => actualLayouts.push(layout))).subscribe({
        complete: () => {
          expect(actualLayouts.length).toBe(expectedLayouts.length);
          expect(actualLayouts.sort()).toEqual(expectedLayouts);
          done();
        },
      });
    },
  );
});
