import { of } from 'rxjs';
import { Deck } from '../config';
import { Paths } from '../file/file';
import { Arguements } from '../types';
import { factory } from './templates';
describe('Layouts', () => {
  it('should map templates to cards', (done) => {
    const cards = [
      { frontTemplate: 'template1', backTemplate: 'template2' },
      { frontTemplate: 'template1', backTemplate: 'template3' },
    ];

    const expectedLayouts = [
      {
        templatePaths: <Paths>{
          filePath: 'template1',
          relativePath: 'rel/template1',
        },
        card: cards[0],
      },
      {
        templatePaths: <Paths>{
          filePath: 'template1',
          relativePath: 'rel/template1',
        },
        card: cards[1],
      },
      {
        templatePaths: <Paths>{
          filePath: 'template2',
          relativePath: 'rel/template2',
        },
        card: cards[0],
      },
      {
        templatePaths: <Paths>{
          filePath: 'template3',
          relativePath: 'rel/template3',
        },
        card: cards[1],
      },
    ];

    const testSubject = factory(
      <Arguements>{},
      <Deck>{},
      of(cards),

      (_: any, filePath: string) =>
        of({ filePath, relativePath: `rel/${filePath}` }),
    );

    testSubject.needsLayout$.subscribe((needsLayout) => {
      expect(needsLayout).toEqual(expectedLayouts.shift());
      if (expectedLayouts.length === 0) {
        done();
      }
    });
  });
});
