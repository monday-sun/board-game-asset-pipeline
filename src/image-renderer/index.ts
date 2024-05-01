import { Arguements, ImageRenderer } from '../types';

type ImageRenderTypes = { nodeIndividual: string };

const imageRenderTypes: ImageRenderTypes = {
  nodeIndividual: './node-html-to-image/node-individual-card-image-renderer',
};

export const findImageRenderer = (
  type: keyof typeof imageRenderTypes | string,
): Promise<(args: Arguements) => ImageRenderer> => {
  return (
    type in imageRenderTypes
      ? import(imageRenderTypes[type as keyof typeof imageRenderTypes])
      : import(type)
  ).then(({ createImageRenderer }) => createImageRenderer);
};
