import { spawn } from 'node:child_process';

import { BaseCommand } from 'commands-base/base-command';
import logger from 'utils/logger';

export default class ApiGenerate extends BaseCommand {
  DEBUG_TAG = 'api:generate';

  static description = `Prepares your environment for custom queries development. run it from your root directory!
                        Creates all necessary files and scripts
                        to start working with custom api queries and mutations.
                        Read the documentation at [@mondaydotcomorg/setup-api](https://github.com/mondaycom/monday-graphql-api/tree/main/packages/setup-api)`;

  async run() {
    try {
      await this.runSetupApi();
      logger.info('setup-api completed successfully');
    } catch (error) {
      logger.debug(error, this.DEBUG_TAG);
      logger.error(`setup-api failed, please make sure you run it in your root directory and try again`);
      throw error;
    }
  }

  runSetupApi() {
    return new Promise<void>((resolve, reject) => {
      const setupApiProcess = spawn('npx', ['@mondaydotcomorg/setup-api@^1.3.1'], { stdio: 'inherit' });

      setupApiProcess.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      setupApiProcess.on('error', error => {
        reject(error);
      });
    });
  }
}
