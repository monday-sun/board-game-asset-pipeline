import * as yaml from 'js-yaml';
import { Observable, map } from 'rxjs';
import { ConfigFactory, Config as ConfigType, DeckConfig } from '..';
import { File } from '../../file/file';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';

export class Config implements ConfigType {
  decks: Observable<DeckConfig[]>;

  constructor(fileContent: FileContent) {
    this.decks = fileContent.content$.pipe(
      map((content) => yaml.load(content.content) as DeckConfig[]),
      map((decks) => {
        decks.forEach((deck) => {
          const outputDir = deck.outputDir;
          deck.output.forEach((outputConfig) => {
            outputConfig.rootOutputDir = outputDir;
          });
        });
        return decks;
      }),
    );
  }
}

export const factory: ConfigFactory = (args: Arguements) => {
  return new Config(FileContent.factory(args, File.factory(args, args.config)));
};
