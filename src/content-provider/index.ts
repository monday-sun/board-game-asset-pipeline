import { ContentProvider } from '../types';

type ContentProviderTypes = { watchContent: string; noWatchContent: string };

const fileProviderTypes: ContentProviderTypes = {
  watchContent: './watch-content/watch-content',
  noWatchContent: './no-watch-content/no-watch-content',
};

export const findContentProvider = (
  type: keyof ContentProviderTypes | string,
): Promise<(filePath: string) => ContentProvider> => {
  return (
    type in fileProviderTypes
      ? import(fileProviderTypes[type as keyof ContentProviderTypes])
      : import(type)
  ).then(({ createContentProvider }) => createContentProvider);
};
