import { AppFeatureType } from 'src/types/services/app-features-service';
import { LogType, LogsFilterCriteriaArguments } from 'types/commands/logs';
import { AccountId, AppId, AppVersionId } from 'types/general';
import { Region } from 'types/general/region';

const BASE_URL = '/api';
const BASE_APPS_URL = '/api/apps';
const BASE_VERSIONS_URL = '/api/app-versions';
const BASE_APP_VERSIONS_URL = '/api/app-versions';
const BASE_MONDAY_CODE_URL = '/api/code';

export const appVersionIdBaseUrl = (appVersionId: number): string => {
  return `${BASE_MONDAY_CODE_URL}/${appVersionId}`;
};

export const getAppVersionDeploymentStatusUrl = (appVersionId: number): string => {
  return `${appVersionIdBaseUrl(appVersionId)}/deployments`;
};

export const getAppFeaturesUrl = (appVersionId: number, types?: AppFeatureType[]): string => {
  const url = `${BASE_APP_VERSIONS_URL}/${appVersionId}/app-features`;
  const appFeatureTypes = types?.map((type, index) => `type[${index}]=${type}`).join('&');
  return appFeatureTypes ? `${url}?${appFeatureTypes}` : url;
};

export const getCreateAppFeatureUrl = (appId: number, appVersionId: number): string => {
  return `${BASE_APPS_URL}/${appId}/app-versions/${appVersionId}/app-features`;
};

export const getCreateAppFeatureReleaseUrl = (appId: number, appVersionId: number, appFeatureId: number): string => {
  return `${BASE_APPS_URL}/${appId}/versions/${appVersionId}/app-features/${appFeatureId}/releases`;
};

export const getDeploymentSignedUrl = (appVersionId: number): string => {
  return `${appVersionIdBaseUrl(appVersionId)}/deployments/signed-url`;
};

export const getDeploymentClientUpload = (appVersionId: number): string => {
  return `${appVersionIdBaseUrl(appVersionId)}/deployments`;
};

export const getStorageItemsSearchUrl = (appId: number, clientAccountId: number, term: string): string => {
  return `/api/storage/app/${appId}/account/${clientAccountId}/records?term=${encodeURI(term)}`;
};

export const getStorageItemsExportUrl = (appId: number, clientAccountId: number): string => {
  return `/api/storage/app/${appId}/account/${clientAccountId}/records/export`;
};

export const getLogsStreamForAppVersionIdUrl = (
  appVersionId: number,
  logsType: LogType,
  logsFilterCriteria?: LogsFilterCriteriaArguments | null,
  region?: Region,
): string => {
  const logsFilterCriteriaParams = logsFilterCriteria
    ? `&fromDate=${logsFilterCriteria.fromDate.getTime()}&toDate=${logsFilterCriteria.toDate.getTime()}&text=${encodeURIComponent(
        logsFilterCriteria.text || '',
      )}`
    : '';
  return `${appVersionIdBaseUrl(appVersionId)}/logs?type=${logsType}${logsFilterCriteriaParams}${
    region ? `&region=${region}` : ''
  }`;
};

export const listAppsUrl = (): string => {
  return BASE_APPS_URL;
};

export const createAppUrl = (): string => {
  return BASE_APPS_URL;
};

export const listAppVersionsByAppIdUrl = (appId: AppId): string => {
  return `${BASE_APPS_URL}/${appId}/versions`;
};

export const getAppVersionsByAppIdUrl = (appVersionId: AppVersionId): string => {
  return `${BASE_VERSIONS_URL}/${appVersionId}`;
};

export const appEnvironmentUrl = (appId: AppId, key: string): string => {
  return `${BASE_MONDAY_CODE_URL}/${appId}/env/${key}`;
};

export const appEnvironmentKeysUrl = (appId: AppId): string => {
  return `${BASE_MONDAY_CODE_URL}/${appId}/env-keys`;
};

export const appSecretUrl = (appId: AppId, key: string): string => {
  return `${BASE_MONDAY_CODE_URL}/${appId}/secrets/${key}`;
};

export const appSecretKeysUrl = (appId: AppId): string => {
  return `${BASE_MONDAY_CODE_URL}/${appId}/secret-keys`;
};

export const appReleasesUrl = (appVersionId: AppId): string => {
  return `/apps_ms/app-versions/${appVersionId}/releases`;
};

export const generateTunnelingTokenUrl = (): string => {
  return `${BASE_MONDAY_CODE_URL}/tunnel-token`;
};

export const getTunnelingDomainUrl = (): string => {
  return `${BASE_MONDAY_CODE_URL}/tunnel-domain`;
};

export const removeAppStorageDataForAccountUrl = (appId: AppId, targetAccountId: AccountId): string => {
  return `${BASE_APPS_URL}/${appId}/accounts/${targetAccountId}`;
};

export const promoteAppUrl = (appId: AppId): string => {
  return `${BASE_APPS_URL}/${appId}/promote`;
};

export const pullPromoteStatusUrl = (path: string): string => {
  return `${BASE_URL}/${path}`;
};

export const createAppFromManifestUrl = (): string => {
  return `${BASE_APPS_URL}/manifest`;
};

export const updateAppFromManifestUrl = (appId: AppId): string => {
  return `${BASE_APPS_URL}/${appId}/manifest`;
};

export const exportAppManifestUrl = (appId: AppId): string => {
  return `${BASE_APPS_URL}/${appId}/manifest?zipBase64=true`;
};
