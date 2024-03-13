import { APP_VERSION_STATUS } from 'consts/app-versions';
import { listAppVersionsByAppIdUrl } from 'consts/urls';
import { execute } from 'services/api-service';
import { listAppVersionsSchema } from 'services/schemas/app-versions-schemas';
import logger from 'src/utils/logger';
import { HttpError } from 'types/errors';
import { AppId } from 'types/general';
import { HttpMethodTypes } from 'types/services/api-service';
import { AppVersion, ListAppVersionsResponse } from 'types/services/app-versions-service';
import { appsUrlBuilder } from 'utils/urls-builder';

export const listAppVersionsByAppId = async (appId: AppId): Promise<Array<AppVersion>> => {
  try {
    const path = listAppVersionsByAppIdUrl(appId);
    const url = appsUrlBuilder(path);
    const response = await execute<ListAppVersionsResponse>(
      {
        url,
        headers: { Accept: 'application/json' },
        method: HttpMethodTypes.GET,
      },
      listAppVersionsSchema,
    );
    const sortedAppVersions = response.appVersions?.sort((a, b) => b.id - a.id);
    return sortedAppVersions;
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new Error('Failed to list app versions.');
  }
};

export const defaultVersionByAppId = async (appId: AppId, useLiveVersion = false): Promise<AppVersion | undefined> => {
  logger.info(`Getting the latest valid version for app id - ${appId}`);

  const appVersions = await listAppVersionsByAppId(appId);
  const latestVersion = appVersions.sort((a, b) => b.id - a.id)[0];
  const allowedStatuses = useLiveVersion
    ? [APP_VERSION_STATUS.LIVE, APP_VERSION_STATUS.DRAFT]
    : [APP_VERSION_STATUS.DRAFT];

  const validVersion = allowedStatuses.includes(latestVersion.status) ? latestVersion : undefined;
  if (validVersion) {
    logger.info(`Using version - ${validVersion?.id} for app id - ${appId}`);
  } else {
    logger.error(`No valid version found for app id - ${appId}`);
  }

  return validVersion;
};
