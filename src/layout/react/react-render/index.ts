import { Observable } from 'rxjs';
import { LayoutResult } from '../..';
import { Card } from '../../../cards';

export type ReactRender = (
  templatePath: string,
  cards: Card[],
) => Observable<LayoutResult[]>;
