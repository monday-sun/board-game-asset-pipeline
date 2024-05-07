import { Observable } from 'rxjs';
import { Card } from '../cards';
import { Arguements } from '../types';

export interface Layout {
  layout$: Observable<{ card: Card; layout: string }>;
  getFormat(): string;
}

export type LayoutFactory = (
  args: Arguements,
  trigger: Observable<{ templatePath: string; card: Card }>,
) => Layout;

type LayoutRenderTypes = { react: string };

const layoutRenderTypes: LayoutRenderTypes = {
  react: './react/react-layout',
};

export const findLayoutFactory = (
  type: keyof typeof layoutRenderTypes | string,
): Promise<LayoutFactory> => {
  return (
    type in layoutRenderTypes
      ? import(layoutRenderTypes[type as keyof typeof layoutRenderTypes])
      : import(type)
  ).then(({ factory }) => factory);
};
