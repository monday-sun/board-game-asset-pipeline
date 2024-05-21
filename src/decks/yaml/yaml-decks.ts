import { filter, map, mergeMap, of, tap } from 'rxjs';
import * as yaml from 'yaml';
import { ConfigFactory, Deck } from '..';
import { FileContent } from '../../file/file-content';
import { Arguments } from '../../types';

export const factory: ConfigFactory = (
  args: Arguments,
  fileContent$: FileContent,
) => {
  return fileContent$.pipe(
    map((content) => yaml.parse(content.content)),
    filter((content) => content !== null && typeof content === 'object'),
    map((content) => (content as { decks: Deck[] }).decks),
    mergeMap((decks) => of(...decks)),
    tap((deck) => args.verbose && console.log('Deck:', deck)),
    map((deck) => {
      const outputDir = deck.outputDir;
      deck.output.forEach((outputConfig) => {
        outputConfig.rootOutputDir = outputDir;
      });
      return deck;
    }),
  );
};
