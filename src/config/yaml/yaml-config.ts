import * as yaml from 'yaml';
import { Observable, filter, map, tap } from 'rxjs';
import { ConfigFactory, Config as ConfigType, DeckConfig } from '..';
import { File } from '../../file/file';
import { FileContent } from '../../file/file-content';
import { Arguements } from '../../types';

export class Config implements ConfigType {
  decks: Observable<DeckConfig[]>;

  constructor(fileContent$: FileContent) {
    this.decks = fileContent$.pipe(
      map((content) => yaml.parse(content.content)),
      filter((content) => content !== null && typeof content === 'object'),
      map((content) => (content as { decks: DeckConfig[] }).decks),
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
