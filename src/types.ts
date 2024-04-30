export type CardInfo = {
  name: string;
  count: string;
  frontTemplate: string;
  backTemplate: string;
  [key: string]: string; // For unknown values
};

export interface LayoutRenderer {
  toHTML(templatePath: string, data: Record<string, string>): Promise<string>;
}
