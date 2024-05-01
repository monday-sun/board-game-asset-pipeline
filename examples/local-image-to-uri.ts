import fs from 'fs';

export function localImageToUri(imageUrl: string) {
  const image = fs.readFileSync(imageUrl);
  const base64Image = Buffer.from(image).toString('base64');
  const dataURI = 'data:image/jpeg;base64,' + base64Image;
  return dataURI;
}
