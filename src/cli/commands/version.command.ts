import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Command } from './command.interface.js';

type PackageJSONConfig = {
  version: string;
};

function isPackageJSONConfig(obj: unknown): obj is PackageJSONConfig {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    Object.hasOwn(obj, 'version')
  );
}

export class VersionCommand implements Command {
  constructor(private readonly path: string = './package.json') {}

  public getName(): string {
    return '--version';
  }

  private readVersion(): string {
    const fileData = readFileSync(resolve(this.path), 'utf-8');
    const importedContent: unknown = JSON.parse(fileData);
    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }
    return importedContent.version;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(chalk.bgMagentaBright(version));
    } catch (error: unknown) {
      console.error(chalk.red(`Failed to read version from ${this.path}`));

      if (error instanceof Error) {
        console.error(chalk.bgRed(error.message));
      }
    }
  }
}
