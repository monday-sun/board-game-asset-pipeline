import fs from 'fs';
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';
import { Observable, from, map, mergeMap } from 'rxjs';
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
          layoutResult.templatePaths.filePath
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
  );
}

export const factory: OutputFactory = (
  _: Arguments,
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
    mergeMap(({ html, content }) => toImages(html, content)),
  );
};
