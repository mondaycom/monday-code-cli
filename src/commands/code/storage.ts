import { Parser } from '@json2csv/plainjs';
import { Flags } from '@oclif/core';
import chalk from 'chalk';

import { AuthenticatedCommand } from 'commands-base/authenticated-command';
import { VAR_UNKNOWN } from 'consts/messages';
import { DynamicChoicesService } from 'services/dynamic-choices-service';
import { PromptService } from 'services/prompt-service';
import { getStorageItemsSearch } from 'services/storage-service';
import { HttpError } from 'types/errors';
import { AppStorageApiRecordsSearchResponseSchema } from 'types/services/storage-service';
import { HttpFS, saveToFile } from 'utils/file-system';
import logger from 'utils/logger';

const clientAccountNumberMessage = 'Client account number';
const termMessage = 'Term to search for';
const csvFilePath =
  'Optional, Directory path and file name in your machine to save as CSV. If not included CSV file will not be saved.';
const jsonFilePath =
  'Optional, Directory path and file name in your machine to save as JSON. If not included JSON file will not be saved.';

const saveToCSV = async (itemsFound: AppStorageApiRecordsSearchResponseSchema, csvPath: string) => {
  const parser = new Parser({
    fields: [
      {
        value: 'key',
        label: 'Key name',
      },
      {
        value: 'backendOnly',
        label: 'can be used only for backend',
      },
      {
        value: 'value',
        label: 'Value',
      },
    ],
  });
  const result: string = parser.parse(itemsFound.records);
  await saveToFile(csvPath, result);
};

const saveToJSON = async (itemsFound: AppStorageApiRecordsSearchResponseSchema, jsonPath: string) => {
  await saveToFile(jsonPath, JSON.stringify(itemsFound.records));
};

const fetchAndPrintStorageKeyValuesResults = (itemsFound: AppStorageApiRecordsSearchResponseSchema) => {
  const maxValueLengthToPrint = 35;
  for (const record of itemsFound.records) {
    record.valueLength = record?.value?.length;
    if (record?.value?.length > maxValueLengthToPrint) {
      record.value = `${record.value.slice(0, maxValueLengthToPrint - 1)}`;
    }
  }

  logger.table(itemsFound.records);
  if (itemsFound.cursor) {
    console.log('There more records, please search for a more specific term.');
  }
};

export default class Storage extends AuthenticatedCommand {
  static description = 'Get keys and values stored on monday for a specific customer.';

  static examples = ['<%= config.bin %> <%= command.id %> -a APP_ID -c CLIENT_ACCOUNT_ID -t TERM'];

  static flags = Storage.serializeFlags({
    appId: Flags.integer({
      char: 'a',
      aliases: ['v'],
      description: 'Select the app that you wish to retrieve the key for',
    }),
    clientAccountId: Flags.integer({
      char: 'c',
      description: `${clientAccountNumberMessage}.`,
    }),
    term: Flags.string({
      char: 't',
      description: `${termMessage}.`,
    }),
    csvPath: Flags.string({
      char: 's',
      description: `${csvFilePath}.`,
    }),
    jsonPath: Flags.string({
      char: 'j',
      description: `${jsonFilePath}.`,
    }),
  });

  public async run(): Promise<void> {
    const { flags } = await this.parse(Storage);
    let { appId, clientAccountId, term } = flags;
    const { csvPath, jsonPath } = flags;
    try {
      if (!appId) {
        appId = await DynamicChoicesService.chooseApp();
      }

      if (!clientAccountId) {
        clientAccountId = await PromptService.promptInputNumber(`${clientAccountNumberMessage}:`, true);
      }

      while (!term) {
        // eslint-disable-next-line no-await-in-loop
        term = await PromptService.promptInput(`${termMessage}:`, true);
        if (!/^[\w:-]+$/.test(term)) {
          logger.warn('Key name can only contain alphanumeric chars and the symbols -_:');
          term = '';
        }
      }

      const itemsFound = await getStorageItemsSearch(appId, clientAccountId, term);
      if (csvPath) {
        await saveToCSV(itemsFound, csvPath);
      }

      if (jsonPath) {
        await saveToJSON(itemsFound, jsonPath);
      }

      fetchAndPrintStorageKeyValuesResults(itemsFound);
      this.preparePrintCommand(this, { appId, clientAccountId, term });
    } catch (error: unknown) {
      if (error instanceof HttpError || error instanceof HttpFS) {
        logger.error(`\n ${chalk.italic(chalk.red(error.message))}`);
      } else {
        logger.error(
          `An unknown error happened while fetching storage items status for app id - "${appId || VAR_UNKNOWN}"`,
        );
      }

      process.exit(1);
    }
  }
}
