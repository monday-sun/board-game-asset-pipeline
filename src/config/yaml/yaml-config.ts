import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Config } from '..';

export class ConfigReader {
  private configPath: string;
  private config: Config | null = null;

  constructor(configPath: string) {
    this.configPath = configPath;
  }

  getConfig() {
    try {
      const fileContents = fs.readFileSync(this.configPath, 'utf8');
      const data = yaml.load(fileContents);
      this.config = data as Config;
    } catch (e) {
      console.error(e);
      this.config = null;
    } finally {
      return this.config;
    }
  }
}
