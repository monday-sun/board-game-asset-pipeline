import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

jest.spyOn(process.stdout, 'write').mockImplementation();
jest.spyOn(process.stderr, 'write').mockImplementation();

describe('render-worker', () => {
  describe('when rendering a valid react component', () => {
    let child: ChildProcessWithoutNullStreams;
    let output: string;
    let error: string;
    beforeEach(() => {
      child = spawn('ts-node', [
        './src/layout/react/render-worker.ts',
        './test/test-component',
        JSON.stringify({ message: 'Hello!' }),
      ]);

      output = '';
      child.stdout.on('data', (chunk) => {
        output += chunk;
      });

      error = '';
      child.stderr.on('data', (chunk) => {
        error += chunk;
      });
    });

    it('should output expected html', (done) => {
      child.on('exit', (code) => {
        expect(output).toEqual('<div>Hello!</div>');
        done();
      });
    });

    it('should not output errors', (done) => {
      child.on('exit', (code) => {
        expect(error).toBeFalsy();
        done();
      });
    });

    it('should exit 0', (done) => {
      child.on('exit', (code) => {
        expect(code).toEqual(0);
        done();
      });
    });
  });
  describe('when rendering a missing file', () => {
    let child: ChildProcessWithoutNullStreams;
    let output: string;
    let error: string;

    beforeEach(() => {
      child = spawn('ts-node', [
        './src/layout/react/render-worker.ts',
        './does-not-exist-component',
        JSON.stringify({ message: 'Hello!' }),
      ]);

      output = '';
      child.stdout.on('data', (chunk) => {
        output += chunk;
      });

      error = '';
      child.stderr.on('data', (chunk) => {
        error += chunk;
      });
    });

    it('should output no html', (done) => {
      child.on('exit', (code) => {
        expect(output).toBeFalsy();
        done();
      });
    });

    it('should output errors', (done) => {
      child.on('exit', (code) => {
        expect(error).toContain(
          "Error: Cannot find module './does-not-exist-component'",
        );
        done();
      });
    });

    it('should exit 1', (done) => {
      child.on('exit', (code) => {
        expect(code).toEqual(1);
        done();
      });
    });
  });

  describe('when rendering a invalid file', () => {
    let child: ChildProcessWithoutNullStreams;
    let output: string;
    let error: string;

    beforeEach(() => {
      child = spawn('ts-node', [
        './src/layout/react/render-worker.ts',
        './test/invalid-component',
        JSON.stringify({ message: 'Hello!' }),
      ]);

      output = '';
      child.stdout.on('data', (chunk) => {
        output += chunk;
      });

      error = '';
      child.stderr.on('data', (chunk) => {
        error += chunk;
      });
    });

    it('should output no html', (done) => {
      child.on('exit', (code) => {
        expect(output).toBeFalsy();
        done();
      });
    });

    it('should output errors', (done) => {
      child.on('exit', (code) => {
        expect(error).toContain('TSError: ⨯ Unable to compile TypeScript:');
        done();
      });
    });

    it('should exit 1', (done) => {
      child.on('exit', (code) => {
        expect(code).toEqual(1);
        done();
      });
    });
  });
});
