import { Observable } from 'rxjs';

export type ReactRender = (
  templatePath: string,
  data: any,
) => Observable<string>;
