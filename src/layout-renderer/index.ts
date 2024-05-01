import { LayoutRenderer } from '../types';

type LayoutRenderTypes = { react: string };

const layoutRenderTypes: LayoutRenderTypes = {
  react: './react/react-layout-renderer',
};

export const findLayoutRenderer = (
  type: keyof typeof layoutRenderTypes | string,
): Promise<() => LayoutRenderer> => {
  return (
    type in layoutRenderTypes
      ? import(layoutRenderTypes[type as keyof typeof layoutRenderTypes])
      : import(type)
  ).then(({ createLayoutRenderer }) => createLayoutRenderer);
};
