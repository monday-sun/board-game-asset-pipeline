import fs from 'fs';
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';
import {
  Arguements,
  CardInfo,
  ImageFileInfo,
  ImageRenderer,
  LayoutRenderer,
} from '../../types';
import { createImageFileName } from '../../util/image-file-name';

type ImageRenderInfo = {
  template: string;
  data: Record<string, string>;
  content: { output: string }[];
  debugHtml?: string;
};

function createOutputList(info: ImageFileInfo, count: number) {
  if (count === 1) {
    return [{ output: createImageFileName(info) }];
  }

  return Array.from({ length: count }, (_, i) => ({
    output: createImageFileName({
      ...info,
      cardNumber: i + 1,
    }),
  }));
}

function cardsToRenderInfo(
  cardInfos: CardInfo[],
  outputPath: string,
  debugHtml: boolean,
): ImageRenderInfo[] {
  return cardInfos
    .map((cardInfo) => {
      const fileInfo = {
        outputPath,
        cardName: cardInfo.name,
      };
      return [
        {
          template: cardInfo.frontTemplate,
          data: cardInfo,
          content: createOutputList(
            { ...fileInfo, suffix: 'front' },
            parseInt(cardInfo.count) || 0,
          ),
          debugHtml: debugHtml
            ? createImageFileName({
                ...fileInfo,
                suffix: 'front',
                outputPath: path.join(fileInfo.outputPath, 'html'),
                format: 'html',
              })
            : undefined,
        },
        {
          template: cardInfo.backTemplate,
          data: cardInfo,
          content: createOutputList(
            { ...fileInfo, suffix: 'back' },
            parseInt(cardInfo.count) || 0,
          ),
          debugHtml: debugHtml
            ? createImageFileName({
                ...fileInfo,
                suffix: 'back',
                outputPath: path.join(fileInfo.outputPath, 'html'),
                format: 'html',
              })
            : undefined,
        },
      ];
    })
    .flat();
}

function saveHtml(html: string, renderInfo: ImageRenderInfo) {
  if (renderInfo.debugHtml) {
    return fs.writeFileSync(renderInfo.debugHtml, html);
  }
}

function toImages(
  html: string,
  content: { output: string }[],
): Promise<string[]> {
  return nodeHtmlToImage({ content, html }).then(() =>
    content.map((c) => c.output),
  );
}

function renderImages(
  renderInfo: ImageRenderInfo[],
  layoutRenderer: LayoutRenderer,
): Promise<string[]>[] {
  return renderInfo.map((info) =>
    info.content.length < 1
      ? Promise.resolve([])
      : layoutRenderer.toHTML(info.template, info.data).then((html) => {
          saveHtml(html, info);
          return toImages(html, info.content);
        }),
  );
}

class NodeIndividualCardImageRenderer implements ImageRenderer {
  constructor(
    private outputPath: string,
    private debugHtml: boolean = false,
  ) {}

  async toImages(
    cardInfos: CardInfo[],
    layoutRenderer: LayoutRenderer,
  ): Promise<string[]> {
    const renderInfo = cardsToRenderInfo(
      cardInfos,
      this.outputPath,
      this.debugHtml,
    );
    return Promise.all(renderImages(renderInfo, layoutRenderer)).then(
      (images) => images.flat(),
    );
  }
}

export function createImageRenderer(args: Arguements): ImageRenderer {
  return new NodeIndividualCardImageRenderer(args.outputDir, args.debugHtml);
}
