import { execFile } from 'child_process';
import * as util from 'util';

const exec = util.promisify(execFile);

describe('react-render', () => {
  it.each([
    {
      file: './test/test-component',
      data: { message: 'Hello!' },
      stdout: '<div>Hello!</div>',
      stderr: '',
      errorMessage: '',
    },
    {
      file: './test/test-component',
      data: { message: 'Hello!' },
      stdout: '<div>Goodbye!</div>',
      stderr: '',
      errorMessage: '',
    },
    {
      file: './does-not-exist-component',
      data: {},
      stdout: '',
      stderr: '',
      errorMessage: "Cannot find module './does-not-exist-component'",
    },
  ])(
    'should load %p',
    ({ file, data, stdout, stderr, errorMessage }, done: jest.DoneCallback) => {
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
          console.log('expected result', expectedResult);
          testSubject
            .then((result) => {
              console.log('result', result);
              expect(result.stdout).toEqual(expectedResult.stdout);
              expect(result.stderr).toEqual(expectedResult.stderr);
              done();
            })
            .catch((error) => {
              // Error should not be thrown if it wasn't expected
              expect(error).toBeFalsy();
              done();
            });
        })
        .catch((expectedError: Error) => {
          testSubject.catch((error: Error) => {
            expect(error.message.split('\n')[5]).toContain(
              expectedError.message.split('\n')[5],
            );
            done();
          });
        });
    },
  );
});
