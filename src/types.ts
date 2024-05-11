export type ImageFileInfo = {
  outputPath: string;
  cardName: string;
  suffix?: string;
  cardNumber?: number;
  format?: string;
};

export type Arguements = {
  [x: string]: unknown;
  config: string;
  watch: boolean;
  test: boolean;
};
