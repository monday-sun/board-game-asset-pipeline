import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { ReactRender } from '..';

export const render: ReactRender = (
  templatePath: string,
  data: any,
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');
      const contents = fs.readFileSync(
        path.join(
          './src/layout/react/react-render/test/fake-renders',
          templatePath.split('/').pop() + '.' + hash + '.json',
        ),
        'utf-8',
      );
      const jsonData = JSON.parse(contents);

      if (jsonData.stderr) {
        process.stderr.write(jsonData.stderr);
      }

      if (jsonData.errorMessage) {
        throw new Error(jsonData.errorMessage);
      }

      resolve(jsonData.stdout);
    } catch (error) {
      reject(error);
    }
  });
};

if (require.main === module) {
  const [templatePath, dataString] = process.argv.slice(2);
  const data = JSON.parse(dataString);
  render(templatePath, data).then((html) => {
    process.stdout.write(html);
  });
}
