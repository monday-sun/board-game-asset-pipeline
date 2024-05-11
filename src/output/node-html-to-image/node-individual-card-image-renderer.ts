import fs from 'fs';
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';
import { Observable, from, map, mergeAll } from 'rxjs';
import { Output, OutputFactory } from '..';
import { OutputConfig } from '../../config';
import { Layout, LayoutResult } from '../../layout';
import { Arguements, ImageFileInfo } from '../../types';
import { createOutputFileName } from '../file-name/output-file-name';

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
): Promise<string[]> {
  return nodeHtmlToImage({ content, html }).then(() =>
    content.map((c) => c.output),
  );
}

class NodeIndividualCardImageOutput implements Output {
  generated$: Observable<string[]>;

  constructor(outputPath: string, layout: Layout) {
    this.generated$ = layout.layout$.pipe(
      map((result) => toRenderInfo(outputPath, result)),
      map(({ html, content }) =>
        from(toImages(html, content)).pipe(
          map(() => content.map((c) => c.output)),
        ),
      ),
      mergeAll(),
    );
  }
}

export const factory: OutputFactory = (
  _: Arguements,
  config: OutputConfig,
  layout: Layout,
): Output => {
  const outputPath = path.join(
    config.rootOutputDir,
    config.outputDir || 'individual-card-images',
  );
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  return new NodeIndividualCardImageOutput(outputPath, layout);
};
