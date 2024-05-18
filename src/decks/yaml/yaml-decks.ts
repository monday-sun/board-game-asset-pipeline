import { filter, map, of, switchMap } from 'rxjs';
import * as yaml from 'yaml';
import { ConfigFactory, Deck } from '..';
import { File } from '../../file/file';
import { FileContent } from '../../file/file-content';
import { Arguments } from '../../types';

export const factory: ConfigFactory = (args: Arguments) => {
  const file$ = File.factory(args, args.config);
  const fileContent$ = FileContent.factory(args, file$);
  return fileContent$.pipe(
    map((content) => yaml.parse(content.content)),
    filter((content) => content !== null && typeof content === 'object'),
    map((content) => (content as { decks: Deck[] }).decks),
    switchMap((decks) => of(...decks)),
    map((deck) => {
      const outputDir = deck.outputDir;
      deck.output.forEach((outputConfig) => {
        outputConfig.rootOutputDir = outputDir;
      });
      return deck;
    }),
  );
};
