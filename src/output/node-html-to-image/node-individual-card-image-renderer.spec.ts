import nodeHtmlToImage from 'node-html-to-image';
import { of } from 'rxjs';
import { LayoutResult } from '../../layout';
import { factory } from './node-individual-card-image-renderer';

jest.mock('node-html-to-image', () =>
  jest.fn().mockImplementation(({ output }) => Promise.resolve(output)),
);

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
      'test-output/individual-card-images/testcard-back.png',
    ];

    testSubject.generated$.subscribe((outputPath) => {
      const expectedOutputPath = expectedOutputPaths.shift();
      expect(outputPath).toEqual([expectedOutputPath]);
      expect(nodeHtmlToImage).toHaveBeenCalledWith({
        content: [{ output: expectedOutputPath }],
        html: 'testLayout',
      });
      done();
    });
  });
});
