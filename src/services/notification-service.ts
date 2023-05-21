import { getLogsStreamForAppVersionIdUrl } from 'consts/urls';
import { execute } from 'services/monday-code-service';
import { clientChannelSchema } from 'services/schemas/notification-schema';
import { LogType } from 'types/commands/logs';
import { ErrorMondayCode } from 'types/errors';
import { HttpMethodTypes } from 'types/services/monday-code-service';
import { ClientChannel } from 'types/services/notification-service';
import logger from 'utils/logger';
import { appsUrlBuilder } from 'utils/urls-builder';

export const logsStream = async (appVersionId: number, logsType: LogType): Promise<ClientChannel> => {
  try {
    const logsStreamForUrl = getLogsStreamForAppVersionIdUrl(appVersionId, logsType);
    const url = appsUrlBuilder(logsStreamForUrl);
    const response = await execute<ClientChannel>(
      {
        url,
        headers: { Accept: 'application/json' },
        method: HttpMethodTypes.GET,
      },
      clientChannelSchema,
    );
    return response;
  } catch (error: any) {
    logger.debug(error);
    if (error instanceof ErrorMondayCode) {
      throw error;
    }

    throw new Error('Failed to open logs channel.');
  }
};
