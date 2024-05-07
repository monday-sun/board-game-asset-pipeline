import { Observable, map, mergeAll, withLatestFrom } from 'rxjs';
import { NeedsLayout } from '.';
import { Card, Cards } from '../cards';
import { FileFactory } from '../file/file';
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

export class Templates {
  needsLayout$: Observable<NeedsLayout>;

  constructor(
    private args: Arguements,
    cards: Cards,
    fileFactory: FileFactory,
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

    this.needsLayout$ = templateUpdate$.pipe(
      withLatestFrom(templateToCards$),
      map(([template, templateToCards]) =>
        templateToCards[template].map((card) => ({
          templatePath: template,
          card,
        })),
      ),
      mergeAll(),
    );

    //    this.layout$ = layoutFactory(this.args, this.needsLayout$).layout$;
  }
}

export namespace Templates {
  export function factory(
    args: Arguements,
    cards: Cards,
    fileFactory: FileFactory,
  ): Templates {
    return new Templates(args, cards, fileFactory);
  }
}
