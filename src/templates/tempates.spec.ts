import { of } from 'rxjs';
import { Card } from '../cards';
import { Deck } from '../decks';
import { Paths } from '../file/file';
import { Arguments } from '../types';
import { factory as testSubject } from './templates';
describe('Layouts', () => {
  it('should map templates to cards', (done) => {
    const cards = [
      <Card>{ frontTemplate: 'template1', backTemplate: 'template2' },
      <Card>{ frontTemplate: 'template1', backTemplate: 'template3' },
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

    const templates$ = testSubject(
      <Arguments>{},
      <Deck>{},
      of(cards),

      (_: any, filePath: string) =>
        of({ filePath, relativePath: `rel/${filePath}` }),
    );

    templates$.subscribe((needsLayout) => {
      expect(needsLayout).toEqual(expectedLayouts.shift());
      if (expectedLayouts.length === 0) {
        done();
      }
    });
  });
});
