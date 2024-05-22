import nodeHtmlToImage from 'node-html-to-image';
import { of } from 'rxjs';
import { Output } from '..';
import { OutputConfig } from '../../decks';
import { LayoutResult } from '../../layout';
import { Arguments } from '../../types';
import { factory as testSubject } from './node-individual-card-image-renderer';

jest.mock('node-html-to-image', () =>
  jest.fn().mockImplementation(({ output }) => Promise.resolve(output)),
);

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(''),
}));
jest.mock('fs', () => ({ existsSync: jest.fn().mockReturnValue(true) }));

describe('RawLayout', () => {
  it("completes factory pipeline with 'nodeIndividual' output", (done) => {
    let defined = false;
    const outputFactory$ = Output.findFactory(<OutputConfig>{
      renderer: 'nodeIndividual',
      rootOutputDir: '',
    });
    outputFactory$.subscribe({
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

  it('should generate correct output', (done) => {
    const layout$ = of(<LayoutResult>{
      templatePaths: { filePath: 'testCard' },
      card: {
        name: 'testCard',
        count: '1',
      },
      layout: 'testLayout',
      format: 'testFormat',
    });

    const generated$ = testSubject(
      <Arguments>{},
      <OutputConfig>{ rootOutputDir: 'test-output' },
      layout$,
    );
    const expectedOutputPaths = [
      'test-output/individual-card-images/testcard-back.png',
    ];

    generated$.subscribe((outputPath) => {
      const expectedOutputPath = expectedOutputPaths.shift();
      expect(outputPath).toEqual([expectedOutputPath]);
      expect(nodeHtmlToImage).toHaveBeenCalledWith({
        content: [{ output: expectedOutputPath }],
        html: 'testLayout',
      });
      done();
    });
  });

  it('should continue after error', (done) => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const layout$ = of(
      <LayoutResult>{
        templatePaths: { filePath: 'testCard' },
        card: {
          name: 'testCard',
          count: '1',
        },
        layout: 'testLayout',
        format: 'testFormat',
      },
      <LayoutResult>{
        templatePaths: { filePath: 'testCard' },
        card: {
          name: 'testCard',
          count: '1',
        },
        layout: 'testLayout',
        format: 'testFormat',
      },
    );

    (nodeHtmlToImage as jest.Mock).mockRejectedValueOnce('testError');

    const generated$ = testSubject(
      <Arguments>{},
      <OutputConfig>{ rootOutputDir: 'test-output' },
      layout$,
    );
    const expectedOutputPaths = [
      'test-output/individual-card-images/testcard-back.png',
    ];

    generated$.subscribe((outputPath) => {
      const expectedOutputPath = expectedOutputPaths.shift();
      expect(outputPath).toEqual([expectedOutputPath]);
      expect(nodeHtmlToImage).toHaveBeenCalledWith({
        content: [{ output: expectedOutputPath }],
        html: 'testLayout',
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error rendering image',
        'testError',
      );
      expect(nodeHtmlToImage).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
