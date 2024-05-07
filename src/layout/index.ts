import path from 'path';
import { cwd } from 'process';
import { Observable } from 'rxjs';
import { Card } from '../cards';
import { Arguements } from '../types';

export interface Layout {
  layout$: Observable<{ templatePath: string; card: Card; layout: string }>;
  getFormat(): string;
}

export type LayoutFactory = (
  args: Arguements,
  trigger: Observable<{ templatePath: string; card: Card }>,
) => Layout;

export namespace Layout {
  type LayoutRenderTypes = { react: string };

  const layoutRenderTypes: LayoutRenderTypes = {
    react: './react/react-layout',
  };

  export const factory = (
    args: Arguements,
    trigger: Observable<{ templatePath: string; card: Card }>,
  ): Promise<Layout> => {
    const type = args.layout;
    return (
      type in layoutRenderTypes
        ? import(layoutRenderTypes[type as keyof typeof layoutRenderTypes])
        : import(path.join(cwd(), type))
    ).then(({ factory }) => factory(args, trigger));
  };
}
