import crypto from 'crypto';
import fsPromises from 'fs/promises';
import path from 'path';
import { Observable, from, map, mergeMap, of } from 'rxjs';
import { ReactRender } from '..';

export const render: ReactRender = (
  templatePath: string,
  data: any,
): Observable<string> => {
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');

  return of(hash).pipe(
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

      return jsonData.stdout;
    }),
  );
};

if (require.main === module) {
  const [templatePath, dataString] = process.argv.slice(2);
  const data = JSON.parse(dataString);
  render(templatePath, data).subscribe((html) => {
    process.stdout.write(html);
  });
}
