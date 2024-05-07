#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs';
import { Cards } from './cards';
import { File } from './file/file';
import { FileContent } from './file/file-content';
import { Layout } from './layout';
import { Output } from './output';
import { Templates } from './templates';
import { Arguements } from './types';

const args: Arguements = yargs(process.argv.slice(2))
  .options({
    cardList: { type: 'string', demandOption: true },
    outputDir: { type: 'string', default: 'generated' },
    cards: { type: 'string', default: 'csv' },
    layout: { type: 'string', default: 'react' },
    output: { type: 'string', default: 'raw' },
    watch: { type: 'boolean', default: false },
  })
  .parseSync();

const { cardList, outputDir, cardsParser, layout, imageRenderer } = args;

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

Promise.all([
  Cards.findFactory(args),
  Templates.findFactory(args),
  Layout.findFactory(args),
  Output.findOutputFactory(args),
]).then(([cardsFactory, templatesFactory, layoutFactory, outputFactory]) => {
  const cardsFile = File.factory(args, cardList);
  const cardsContent = FileContent.factory(args, cardsFile);
  const cards = cardsFactory(args, cardsContent);
  const templates = templatesFactory(args, cards, File.factory);
  const layout = layoutFactory(args, templates);
  const output = outputFactory(args, layout);
  output.generated$.subscribe((outputPath) => {
    console.log(`Generated ${outputPath}`);
  });
});
