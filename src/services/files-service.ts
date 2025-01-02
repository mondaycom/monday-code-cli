import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import AdmZip from 'adm-zip';
import archiver from 'archiver';
import glob from 'glob';
import parseGitIgnore from 'parse-gitignore';
import { ZodError } from 'zod';

import { CONFIG_NAME } from 'services/config-service';
import { mondaycodercSchema } from 'services/schemas/mondaycoderc-schema';

import logger from '../utils/logger.js';

export const readFileData = (filePath: string): Buffer => {
  if (!checkIfFileExists(filePath)) {
    throw new Error(`File not found: "${filePath}"`);
  }

  const fileData = fs.readFileSync(filePath);
  return fileData;
};

export const readZipFileAsBuffer = (filePath: string): Buffer => {
  return fs.readFileSync(filePath);
};

/**
 * Decompress a ZIP buffer and extract files to the output directory.
 * @param buffer - The ZIP buffer.
 * @param outputDir - The directory where files should be extracted.
 */
export const decompressZipBufferToFiles = async (buffer: Buffer, outputDir: string): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const zip = new AdmZip(buffer);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  zip.extractAllTo(outputDir, true);
};

export const compressFilesToZip = async (files: string[]): Promise<string> => {
  const tempZipPath = 'temp.zip';
  const output = fs.createWriteStream(tempZipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);
  for (const file of files) {
    const fileName = path.basename(file);
    archive.file(file, { name: fileName });
  }

  await archive.finalize();
  await new Promise<void>(resolve => {
    output.on('close', () => resolve());
  });
  return tempZipPath;
};

export const compressBuildToZip = async (dirPath: string) => {
  const fileName = `${dirPath}.zip`;

  const output = fs.createWriteStream(fileName);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.pipe(output);
  archive.directory(dirPath, false);

  await archive.finalize();
  await new Promise<void>(resolve => {
    output.on('close', () => resolve());
  });
  return fileName;
};

export const verifyClientDirectory = (directoryPath: string): void => {
  if (!checkIfFileExists(directoryPath)) {
    throw new Error(`Directory not found: ${directoryPath}`);
  }

  if (!checkIfFileExists(`${directoryPath}/index.html`)) {
    throw new Error(`index.html file not found in ${directoryPath}`);
  }
};

export const checkIfFileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

export const getFileExtension = (filePath: string): string => {
  return path.extname(filePath).slice(1);
};

export const createTarGzArchive = async (directoryPath: string, fileName = 'code'): Promise<string> => {
  const DEBUG_TAG = 'create_archive';
  try {
    logger.debug({ directoryPath }, `${DEBUG_TAG} - Check directory exists`);
    const directoryExists = fs.existsSync(directoryPath);
    if (!directoryExists) {
      throw new Error(`Directory not found: ${directoryPath}`);
    }

    const archivePath = `${directoryPath}/${fileName}.tar.gz`;
    const fullFileName = `**/${fileName}.tar.gz`;

    // a special list of files to ignore that are not in .gitignore that is may or may not be in the project
    const additionalFilesToIgnore = [
      '.git/**',
      '.env',
      'local-secure-storage.db.json',
      '.mappsrc',
      'node_modules/**',
      'mvnw',
    ];
    const pathsToIgnoreFromGitIgnore = getFilesToExcludeForArchive(directoryPath);
    const pathsToIgnore = [...pathsToIgnoreFromGitIgnore, archivePath, fullFileName, ...additionalFilesToIgnore];

    await compressDirectoryToTarGz(directoryPath, archivePath, pathsToIgnore);
    return archivePath;
  } catch (error) {
    logger.debug(error, DEBUG_TAG);
    throw new Error('Failed in creating archive');
  }
};

export const createGitignoreAndAppendConfigFileIfNeeded = (directoryPath: string, fileName = CONFIG_NAME) => {
  const filePath = path.join(directoryPath, '.gitignore');
  if (!checkIfFileExists(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
  }

  const gitignoreContent = fs.readFileSync(filePath, 'utf8');
  if (!gitignoreContent.includes(fileName)) {
    fs.appendFileSync(filePath, `\n${fileName}`, 'utf8');
  }
};

/**
 * Detect if the project is yarn project with a build step
 * if so, we will need to abort the build process as
 * gcloud buildpacks does not support it yet
 * @param directoryPath the path where the project is located
 * @throws Error if the project is yarn project with a build step
 * @returns void
 **/
export const validateIfCanBuild = (directoryPath: string): void => {
  const filePath = path.join(directoryPath, 'yarn.lock');
  if (checkIfFileExists(filePath)) {
    const packageJsonPath = path.join(directoryPath, 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent) as { scripts?: { build?: string } };
    const hasBuildCommand = packageJson?.scripts?.build;
    if (hasBuildCommand) {
      throw new Error(
        'monday-code does not support yarn projects with a build command. If you need a build step, use npm instead',
      );
    }
  }

  const rcFilePath = path.join(directoryPath, '.mondaycoderc');
  if (checkIfFileExists(rcFilePath)) {
    const rcFileContent = JSON.parse(fs.readFileSync(rcFilePath, 'utf8')) as {
      RUNTIME: string;
      RUNTIME_VERSION: string;
    };
    try {
      mondaycodercSchema.parse(rcFileContent);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new TypeError(error.errors[0].message);
      }

      throw error;
    }
  }
};

//* ** PRIVATE METHODS ** *//

const getFilesToExcludeForArchive = (directoryPath: string): string[] => {
  const DEBUG_TAG = 'ignore_files_for_archive';
  const mappsIgnorePath = getIgnorePath(directoryPath, '.mappsignore');
  if (mappsIgnorePath) {
    return findIgnoredFiles(directoryPath, mappsIgnorePath);
  }

  const gitIgnorePath = getIgnorePath(directoryPath, '.gitignore');
  if (gitIgnorePath) {
    return findIgnoredFiles(directoryPath, gitIgnorePath);
  }

  logger.debug(`${DEBUG_TAG} - No ignore files found, you can use .gitignore or
    .mappsignore to exclude some of the folders and files in your project`);

  return [];
};

const getIgnorePath = (directoryPath: string, ignoreFile: string): string | undefined => {
  const DEBUG_TAG = 'ignore_files_for_archive';
  logger.debug(`${DEBUG_TAG} - Searching for ${ignoreFile} file`);
  let ignoreSearchPattern = `${directoryPath}/**/${ignoreFile}`;
  if (os.platform() === 'win32') {
    ignoreSearchPattern = ignoreSearchPattern.replaceAll('\\', '/');
  }

  const [ignorePath] = glob.sync(ignoreSearchPattern);
  return ignorePath;
};

const findIgnoredFiles = (directoryPath: string, ignorePath: string): string[] => {
  const DEBUG_TAG = 'ignore_files_for_archive';
  logger.debug(`${DEBUG_TAG} - Found ${ignorePath}`);
  logger.debug(`${DEBUG_TAG} - Creating exclude files list`);
  const parsedIgnore = parseGitIgnore.parse(ignorePath);
  logger.debug(`${DEBUG_TAG} - validating and aligning exclude files list`);
  const filesToExclude = alignPatternsForArchive(parsedIgnore?.patterns, directoryPath);
  return filesToExclude;
};

const alignPatternsForArchive = (patterns: string[], directoryPath: string): string[] => {
  const alignedPatterns = patterns?.reduce<string[]>((realPatterns, pattern) => {
    const slashCharIfNeeded = pattern[0] === '/' ? '' : '/';
    const fullPath = `${directoryPath}${slashCharIfNeeded}${pattern}`;
    if (!fs.existsSync(fullPath)) return realPatterns;
    if (fs.statSync(fullPath).isDirectory()) {
      const addGlobPattern = pattern.at(-1) === '/' ? '**' : '/**';
      const patternWithoutBeginningSlash = pattern[0] === '/' ? pattern.slice(1, pattern.length) : pattern;
      realPatterns.push(`${patternWithoutBeginningSlash}${addGlobPattern}`);
    } else {
      realPatterns.push(pattern);
    }

    return realPatterns;
  }, []);

  return alignedPatterns;
};

const compressDirectoryToTarGz = async (
  directoryPath: string,
  archivePath: string,
  pathsToIgnore?: string[],
): Promise<string> => {
  const DEBUG_TAG = 'archive';
  logger.debug({ directoryPath, archivePath }, `${DEBUG_TAG} - Starting`);

  const outputStream = fs.createWriteStream(archivePath);
  const archive = archiver('tar', {
    gzip: true,
    gzipOptions: {
      level: 1,
    },
  });

  logger.debug(`${DEBUG_TAG} - Initialized`);
  await new Promise((resolve, reject) => {
    archive.pipe(outputStream);
    logger.debug(pathsToIgnore, `${DEBUG_TAG} - Added paths to ignore`);
    archive.glob('**/*', {
      cwd: directoryPath,
      ignore: pathsToIgnore,
      nodir: true,
      dot: true,
    });
    logger.debug(`${DEBUG_TAG} - Added directory`);

    outputStream.on('close', resolve);
    archive.on('error', reject);
    archive.finalize().catch(reject);
  });
  logger.debug(`${DEBUG_TAG} - created successfully`);

  return archivePath;
};

/**
 * Writes a buffer to a file at the specified path.
 * @param filePath - The path where the file will be created.
 * @param dataBuffer - The buffer containing the file data.
 */
export const writeBufferToFile = (filePath: string, dataBuffer: Buffer): void => {
  try {
    fs.writeFileSync(filePath, dataBuffer);
  } catch (error) {
    logger.error(`Failed to write file to ${filePath}:`, error);
    throw new Error(`Failed to write file to ${filePath}`);
  }
};
