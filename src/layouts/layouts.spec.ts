import { of } from 'rxjs';
import { Cards } from '../cards';
import { Layouts } from './layouts';

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
      },
      {
        templatePath: 'template1',
        card: cards[1],
      },
      {
        templatePath: 'template2',
        card: cards[0],
      },
      {
        templatePath: 'template3',
        card: cards[1],
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
    );

    testSubject.needsLayout$.subscribe((needsLayout) => {
      expect(needsLayout).toEqual(expectedLayouts.shift());
      if (expectedLayouts.length === 0) {
        done();
      }
    });
  });
});
