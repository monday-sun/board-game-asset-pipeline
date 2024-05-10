import { execFile } from 'child_process';
import * as util from 'util';

const exec = util.promisify(execFile);

describe('react-render', () => {
  const testCases: {
    file: string;
    data: any;
    stdout: string;
    stderr: string;
    errorMessage: string;
  }[] = [
    {
      file: './test/test-component',
      data: { message: 'Hello!' },
      stdout: '<div>Hello!</div>',
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
  ];
  it.each(testCases)(
    'should load %p',
    ({ file, data, stdout, stderr, errorMessage }, done: jest.DoneCallback) => {
      const testSubject = exec('node', [
        './build/src/layout/react/react-render/react-render',
        file,
        JSON.stringify(data),
      ]);

      testSubject
        .then((result) => {
          expect(result.stdout).toEqual(stdout);
          expect(result.stderr).toEqual(stderr);
          done();
        })
        .catch((error) => {
          expect(error?.message).toContain(errorMessage);
          done();
        });
    },
  );
});
