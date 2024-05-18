import { Observable, of, tap } from 'rxjs';
import { Layout, LayoutResult } from '..';
import { Deck } from '../../config';
import { Paths } from '../../file/file';
import { NeedsLayout } from '../../templates';
import { Arguments } from '../../types';
import { factory } from './react-layout';

const testSubject = factory as (
  args: Arguments,
  _: Deck,
  templates$: Observable<NeedsLayout>,
  reactRenderPath: string,
) => Observable<LayoutResult>;

describe('ReactLayout', () => {
  it("completes factory pipeline with 'react' layout", (done) => {
    let defined = false;
    const cardsFactory$ = Layout.findFactory(
      <Arguments>{},
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
        <Arguments>{ watch },
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
        'test/fake-react-render',
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
