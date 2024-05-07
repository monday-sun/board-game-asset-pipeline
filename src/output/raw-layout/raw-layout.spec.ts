import fsPromises from 'fs/promises';
import { of } from 'rxjs';
import { LayoutResult } from '../../layout';
import { factory } from './raw-layout';

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(''),
}));
jest.mock('fs', () => ({ existsSync: jest.fn().mockReturnValue(true) }));

describe('RawLayout', () => {
  beforeEach(() => {});

  it('should generate correct output', (done) => {
    const layout$ = of(
      ...[
        <LayoutResult>{
          templatePaths: { filePath: 'testCard' },
          card: {
            name: 'testCard',
            count: '1',
          },
          layout: 'testLayout',
          format: 'testFormat',
        },
      ],
    );

    const testSubject = factory({ outputDir: 'test-output' } as any, {
      layout$,
    });
    const expectedOutputPaths = [
      'test-output/raw-layout/testcard-back.testFormat',
    ];

    testSubject.generated$.subscribe((outputPath) => {
      const expectedOutputPath = expectedOutputPaths.shift();
      expect(outputPath).toEqual(expectedOutputPath);
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expectedOutputPath,
        'testLayout',
      );
      done();
    });
  });
});
