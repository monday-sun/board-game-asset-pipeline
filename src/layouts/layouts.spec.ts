import { of } from 'rxjs';
import { Cards } from '../cards';
import { Layouts } from './layouts';
import { factory as testLayoutFactory } from './test-layout';

describe('Layouts', () => {
  it('should map templates to cards', (done) => {
    const cards = [
      { frontTemplate: 'template1', backTemplate: 'template2' },
      { frontTemplate: 'template1', backTemplate: 'template3' },
    ];

    const expectedLayouts = [
      {
        templatePath: 'template1',
        card: cards[0],
        layout: 'test',
      },
      {
        templatePath: 'template1',
        card: cards[1],
        layout: 'test',
      },
      {
        templatePath: 'template2',
        card: cards[0],
        layout: 'test',
      },
      {
        templatePath: 'template3',
        card: cards[1],
        layout: 'test',
      },
    ];

    const testSubject = Layouts.factory(
      {} as any,
      <Cards>{
        cards$: of(cards),
      },
      (_: any, filePath: string) => ({
        path$: of(filePath),
      }),
      testLayoutFactory,
    );

    testSubject.layout$.subscribe((layout) => {
      expect(layout).toEqual(expectedLayouts.shift());
      if (expectedLayouts.length === 0) {
        done();
      }
    });
  });
});
