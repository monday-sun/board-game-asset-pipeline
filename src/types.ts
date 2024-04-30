export type CardInfo = {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate: string;
  [key: string]: string; // For unknown values
};
