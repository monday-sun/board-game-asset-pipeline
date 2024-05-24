import crypto from 'crypto';
import fsPromises from 'fs/promises';
import path from 'path';
import { Observable, from, map, mergeMap, toArray } from 'rxjs';
import { ReactRender } from '..';
import { LayoutResult } from '../../..';
import { Card } from '../../../../cards';

export const render: ReactRender = (
  templatePath: string,
  cards: Card[],
): Observable<LayoutResult[]> => {
  return from(cards).pipe(
    map((card) =>
      crypto.createHash('sha256').update(JSON.stringify(card)).digest('hex'),
    ),
    mergeMap((hash) =>
      from(
        fsPromises.readFile(
          path.join(
            './src/layout/react/react-render/test/fake-renders',
            templatePath.split('/').pop() + '.' + hash + '.json',
          ),
          'utf-8',
        ),
      ),
    ),
    map((contents) => JSON.parse(contents)),
    map((jsonData) => {
      if (jsonData.stderr) {
        process.stderr.write(jsonData.stderr);
      }

      if (jsonData.errorMessage) {
        throw new Error(jsonData.errorMessage);
      }

      return jsonData.stdout as LayoutResult;
    }),
    toArray(),
  );
};

if (require.main === module) {
  const [templatePath, dataString] = process.argv.slice(2);
  const data = JSON.parse(dataString);
  render(templatePath, data).subscribe((layoutResult) => {
    process.stdout.write(JSON.stringify(layoutResult));
  });
}
