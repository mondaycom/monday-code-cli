import { z } from 'zod';

import { baseResponseHttpMetaDataSchema } from 'services/schemas/api-service-schemas';

export const signedUrlSchema = z
  .object({
    signed: z.string(),
  })
  .merge(baseResponseHttpMetaDataSchema);

export const deploymentStatusTypesArray = [
  'started',
  'pending',
  'building',
  'successful',
  'failed',
  'building-infra',
  'building-app',
] as const;

export const deploymentStatusTypesSchema = z.enum(deploymentStatusTypesArray);

export const appVersionDeploymentStatusSchema = z
  .object({
    status: deploymentStatusTypesSchema,
    deployment: z
      .object({
        url: z.string(),
        latestUrl: z.string(),
      })
      .optional(),
    error: z
      .object({
        message: z.string(),
      })
      .optional(),
  })
  .merge(baseResponseHttpMetaDataSchema);
