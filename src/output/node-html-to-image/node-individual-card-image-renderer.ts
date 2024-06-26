import fs from 'fs';
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';
import {
  Observable,
  catchError,
  filter,
  from,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';
import { OutputFactory } from '..';
import { OutputConfig } from '../../decks';
import { LayoutResult } from '../../layout';
import { Arguments } from '../../types';
import {
  ImageFileInfo,
  createOutputFileName,
} from '../file-name/output-file-name';

type ImageRenderInfo = {
  html: string;
  content: { output: string }[];
};

function createOutputList(info: ImageFileInfo, count: number) {
  if (count === 1) {
    return [{ output: createOutputFileName(info) }];
  }

  return Array.from({ length: count }, (_, i) => ({
    output: createOutputFileName({
      ...info,
      cardNumber: i + 1,
    }),
  }));
}

function toRenderInfo(
  outputPath: string,
  layoutResult: LayoutResult,
): ImageRenderInfo {
  return {
    html: layoutResult.layout,
    content: createOutputList(
      {
        outputPath,
        cardName: layoutResult.card.name,
        suffix:
          layoutResult.card.frontTemplate ===
          layoutResult.template
            ? 'front'
            : 'back',
      },
      parseInt(layoutResult.card.count) || 0,
    ),
  };
}

function toImages(
  html: string,
  content: { output: string }[],
): Observable<string[]> {
  return from(nodeHtmlToImage({ content, html })).pipe(
    map(() => content.map((c) => c.output)),
    catchError((error) => {
      console.error('Error rendering image', error);
      return of([]);
    }),
  );
}

export const factory: OutputFactory = (
  args: Arguments,
  config: OutputConfig,
  layout$: Observable<LayoutResult>,
) => {
  const outputPath = path.join(
    config.rootOutputDir,
    config.outputDir || 'individual-card-images',
  );
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  return layout$.pipe(
    map((result) => toRenderInfo(outputPath, result)),
    tap((renderInfo) => args.verbose && console.info('Rendering:', renderInfo)),
    mergeMap(({ html, content }) => toImages(html, content)),
    filter((images) => images.length > 0),
  );
};
