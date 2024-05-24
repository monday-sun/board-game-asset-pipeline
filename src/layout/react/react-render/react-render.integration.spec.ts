import { execFile } from 'child_process';
import * as util from 'util';

const exec = util.promisify(execFile);

describe('react-render', () => {
  it.each`
    case
    ${{
  name: 'Hello',
  file: './test/test-component',
  data: { message: 'Hello!' },
}}
    ${{
  name: 'Goodbye',
  file: './test/test-component',
  data: { message: 'Goodbye!' },
}}
    ${{
  name: 'Error',
  file: './does-not-exist-component',
  data: {},
}}
  `(
    'should load $case.name',
    ({ case: { file, data } }, done: jest.DoneCallback) => {
      const fakeSubject = exec('ts-node', [
        './src/layout/react/react-render/test/fake-react-render',
        file,
        JSON.stringify(data),
      ]);
      const testSubject = exec('ts-node', [
        './src/layout/react/react-render/react-render',
        file,
        JSON.stringify(data),
      ]);

      fakeSubject
        .then((expectedResult) => {
          testSubject
            .then((result) => {
              console.log(result);
              console.log(expectedResult);
              expect(result.stdout).toEqual(expectedResult.stdout);
              expect(result.stderr).toEqual(expectedResult.stderr);
              done();
            })
            .catch((error) => {
              // Error should not be thrown if it wasn't expected
              expect(error).toBeFalsy();
              console.log(error);
              done();
            });
        })
        .catch((expectedError: Error) => {
          testSubject
            .then((result) => {
              // should not have result if error was expected
              expect(result).toBeFalsy();
              console.log(result);
              done();
            })
            .catch((error: Error) => {
              const afterError = expectedError.message.split('Error: ').pop();
              const errorMessage = afterError?.split(`\n`)[0];
              expect(errorMessage).toBeTruthy();
              expect(error.message).toEqual(
                expect.stringContaining(errorMessage as string),
              );
              console.log('Error', error);
              console.log('Expected', expectedError);

              done();
            });
        });
    },
  );
});
