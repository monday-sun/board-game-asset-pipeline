import { Observable, map, mergeAll, tap, withLatestFrom } from 'rxjs';
import { NeedsLayout, TemplatesFactory } from '.';
import { Card, Cards } from '../cards';
import { DeckConfig } from '../config';
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

function gatherTemplates(cards: Card[]) {
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
      map((cards) => gatherTemplates(cards)),
    );

    const templateUpdate$ = templateToCards$.pipe(
      map((templateToCards) => Object.keys(templateToCards)),
      mergeAll(),
      map((template) => fileFactory(this.args, template).path$),
      mergeAll(),
    );

    this.needsLayout$ = templateUpdate$.pipe(
      withLatestFrom(templateToCards$),
      map(([templatePaths, templateToCards]) =>
        templateToCards[templatePaths.filePath].map((card) => ({
          templatePaths,
          card,
        })),
      ),
      mergeAll(),
      tap(({ card, templatePaths }) =>
        console.log(
          'Requested layout for card:',
          card.name,
          ', with template:',
          templatePaths.filePath,
        ),
      ),
    );
  }
}

export const factory: TemplatesFactory = (
  args: Arguements,
  _: DeckConfig,
  cards: Cards,
  fileFactory: FileFactory,
): Templates => {
  return new Templates(args, cards, fileFactory);
};
