import { Observable, map, mergeAll, withLatestFrom } from 'rxjs';
import { Card, Cards } from '../cards';
import { FileFactory } from '../file/file';
import { LayoutFactory } from '../layout';
import { Arguements } from '../types';

function addCardToTemplate(
  templatesToCards: { [key: string]: Card[] },
  template: string,
  card: Card,
) {
  const cards = templatesToCards[template] || [];
  cards.push(card);
  templatesToCards[template] = cards;
}

function mapTemplatesToCards(cards: Card[]) {
  const templatesToCards: { [key: string]: Card[] } = {};

  cards.forEach((card) => {
    if (card.frontTemplate) {
      addCardToTemplate(templatesToCards, card.frontTemplate, card);
    }

    if (card.backTemplate && card.backTemplate !== card.frontTemplate) {
      addCardToTemplate(templatesToCards, card.backTemplate, card);
    }
  });

  return templatesToCards;
}

export class Layouts {
  layout$: Observable<{ templatePath: string; layout: string; card: Card }>;

  constructor(
    private args: Arguements,
    cards: Cards,
    fileFactory: FileFactory,
    layoutFactory: LayoutFactory,
  ) {
    const templateToCards$ = cards.cards$.pipe(
      map((cards) => mapTemplatesToCards(cards)),
    );

    const templateUpdate$ = templateToCards$.pipe(
      map((templateToCards) => Object.keys(templateToCards)),
      mergeAll(),
      map((template) => fileFactory(this.args, template).path$),
      mergeAll(),
    );

    const needsLayout$ = templateUpdate$.pipe(
      withLatestFrom(templateToCards$),
      map(([template, templateToCards]) =>
        templateToCards[template].map((card) => ({
          templatePath: template,
          card,
        })),
      ),
      mergeAll(),
    );

    this.layout$ = layoutFactory(this.args, needsLayout$).layout$;
  }
}

export namespace Layouts {
  export function factory(
    args: Arguements,
    cards: Cards,
    fileFactory: FileFactory,
    layoutFactory: LayoutFactory,
  ): Layouts {
    return new Layouts(args, cards, fileFactory, layoutFactory);
  }
}
