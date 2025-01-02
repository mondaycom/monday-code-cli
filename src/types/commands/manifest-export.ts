import type { AppId, AppVersionId } from 'types/general';

export type ExportCommandTasksContext = {
  appId: AppId;
  appVersionId?: AppVersionId;
};
