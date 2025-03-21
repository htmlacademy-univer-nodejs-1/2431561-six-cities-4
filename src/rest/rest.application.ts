import { Logger } from '../shared/libs/logger/logger.interface.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../shared/types/component.enum.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  public async init() {
    this.logger.info('Initializing Application...');
    this.logger.info(`Get value from .env $PORT: ${this.config.get('PORT')}`);
  }
}
