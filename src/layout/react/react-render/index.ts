import { Observable } from 'rxjs';
import { LayoutResult } from '../..';

export type ReactRender = (
  templatePath: string,
  data: any,
) => Observable<LayoutResult>;
