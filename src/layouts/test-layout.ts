import { Observable, map } from 'rxjs';
import { Card } from '../cards';
import { Layout, LayoutFactory } from '../layout';
import { Arguements } from '../types';

class TestLayout implements Layout {
  layout$: Observable<{ templatePath: string; card: Card; layout: string }>;

  constructor(
    args: Arguements,
    trigger: Observable<{ templatePath: string; card: Card }>,
  ) {
    this.layout$ = trigger.pipe(
      map((trigger) => ({
        ...trigger,
        layout: 'test',
      })),
    );
  }
  getFormat(): string {
    return 'test';
  }
}

export const factory: LayoutFactory = (
  args: Arguements,
  trigger: Observable<{ templatePath: string; card: Card }>,
) => {
  return new TestLayout(args, trigger);
};
