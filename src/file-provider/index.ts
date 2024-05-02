import { FileProvider } from '../types';

type FileProviderTypes = { watchContent: string; noWatchContent: string };

const fileProviderTypes: FileProviderTypes = {
  watchContent: './watch-content/watch-content',
  noWatchContent: './no-watch-content/no-watch-content',
};

export const findFileProvider = (
  type: keyof FileProviderTypes | string,
): Promise<(filePath: string) => FileProvider> => {
  return (
    type in fileProviderTypes
      ? import(fileProviderTypes[type as keyof FileProviderTypes])
      : import(type)
  ).then(({ createFileProvider }) => createFileProvider);
};
