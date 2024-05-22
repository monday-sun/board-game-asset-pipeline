import fsPromises from 'fs/promises';
import { of } from 'rxjs';
import { Output } from '..';
import { OutputConfig } from '../../decks';
import { LayoutResult } from '../../layout';
import { Arguments } from '../../types';
import { factory as testSubject } from './raw-layout';

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(''),
}));
jest.mock('fs', () => ({ existsSync: jest.fn().mockReturnValue(true) }));

describe('RawLayout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("completes factory pipeline with 'raw' output", (done) => {
    let defined = false;
    const outputFactory$ = Output.findFactory(<OutputConfig>{
      renderer: 'raw',
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
      'test-output/raw-layout/testcard-back.testFormat',
    ];

    generated$.subscribe((outputPath) => {
      const expectedOutputPath = expectedOutputPaths.shift();
      expect(outputPath).toEqual([expectedOutputPath]);
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expectedOutputPath,
        'testLayout',
      );
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

    (fsPromises.writeFile as jest.Mock).mockRejectedValueOnce(
      new Error('test error'),
    );

    const generated$ = testSubject(
      <Arguments>{},
      <OutputConfig>{ rootOutputDir: 'test-output' },
      layout$,
    );
    const expectedOutputPaths = [
      'test-output/raw-layout/testcard-back.testFormat',
    ];

    generated$.subscribe((outputPath) => {
      const expectedOutputPath = expectedOutputPaths.shift();
      expect(outputPath).toEqual([expectedOutputPath]);
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expectedOutputPath,
        'testLayout',
      );
      expect(fsPromises.writeFile).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error writing file',
        new Error('test error'),
      );
      done();
    });
  });
});
