import { Flags } from '@oclif/core';
import { Listr } from 'listr2';

import { AuthenticatedCommand } from 'commands-base/authenticated-command';
import { DynamicChoicesService } from 'services/dynamic-choices-service';
import * as importService from 'services/import-app-service';
import { PromptService } from 'services/prompt-service';
import { ImportCommandTasksContext } from 'types/commands/app-import';
import logger from 'utils/logger';

const MESSAGES = {
  path: 'Path of you manifest file in your machine',
  appId: 'App id (will create new draft version)',
  appVersionId: 'App version id to override',
  newApp: 'Create new app',
};

export default class AppImport extends AuthenticatedCommand {
  static description = 'Import manifest.';
  static withPrintCommand = false;
  static examples = ['<%= config.bin %> <%= command.id %>'];
  static flags = AppImport.serializeFlags({
    manifestPath: Flags.string({
      char: 'p',
      description: MESSAGES.path,
    }),
    appId: Flags.string({
      char: 'a',
      aliases: ['appId'],
      description: MESSAGES.appId,
    }),
    appVersionId: Flags.string({
      char: 'v',
      aliases: ['versionId'],
      description: MESSAGES.appVersionId,
    }),
    newApp: Flags.boolean({
      description: MESSAGES.newApp,
      char: 'n',
      aliases: ['new'],
      default: false,
    }),
  });

  DEBUG_TAG = 'app_import';

  async getAppVersionId(appVersionId: number | undefined, appId: number | undefined): Promise<number> {
    if (appVersionId) return appVersionId;

    const latestDraftVersion = await DynamicChoicesService.chooseAppAndAppVersion(false, false, {
      appId: Number(appId),
      autoSelectVersion: false,
    });

    return latestDraftVersion.appVersionId;
  }

  public async run(): Promise<void> {
    try {
      const { flags } = await this.parse(AppImport);
      let { manifestPath } = flags;
      const { appId: appIdAsString, appVersionId: appVersionIdAsString, newApp } = flags;
      let appId = appIdAsString ? Number(appIdAsString) : undefined;
      let appVersionId = appVersionIdAsString ? Number(appVersionIdAsString) : undefined;

      if (!manifestPath) {
        manifestPath = await PromptService.promptFile(MESSAGES.path, ['json', 'yaml']);
      }

      const shouldCreateNewApp = await importService.shouldCreateNewApp({ appId, appVersionId, newApp });
      if (!shouldCreateNewApp) {
        appId = await DynamicChoicesService.chooseApp();
      }

      const shouldCreateNewAppVersion = await importService.shouldCreateNewAppVersion({
        appId,
        appVersionId,
        newApp: shouldCreateNewApp,
      });

      if (!shouldCreateNewAppVersion && !shouldCreateNewApp) {
        appVersionId = await this.getAppVersionId(appVersionId, appId);
      }

      this.preparePrintCommand(this, { appVersionId, manifestPath, appId, newApp: shouldCreateNewApp });

      const ctx = { appVersionId, appId, manifestFilePath: manifestPath };
      const tasks = new Listr<ImportCommandTasksContext>(
        [{ title: 'Importing app manifest', task: importService.uploadManifestTsk }],
        { ctx },
      );

      await tasks.run();
    } catch (error) {
      logger.debug(error, this.DEBUG_TAG);
      process.exit(1);
    }
  }
}
