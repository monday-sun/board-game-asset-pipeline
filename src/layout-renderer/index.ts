import { Arguements } from '../types';

export interface LayoutRenderer {
  toHTML(templatePath: string, data: Record<string, string>): Promise<string>;
}

type LayoutRenderTypes = { react: string };

const layoutRenderTypes: LayoutRenderTypes = {
  react: './react/react-layout-renderer',
};

export const findLayoutRenderer = (
  type: keyof typeof layoutRenderTypes | string,
): Promise<(args: Arguements) => LayoutRenderer> => {
  return (
    type in layoutRenderTypes
      ? import(layoutRenderTypes[type as keyof typeof layoutRenderTypes])
      : import(type)
  ).then(({ createLayoutRenderer }) => createLayoutRenderer);
};
