import { Observable, debounceTime, map, mergeAll, withLatestFrom } from 'rxjs';
import { NeedsLayout, TemplatesFactory } from '.';
import { Card } from '../cards';
import { Deck } from '../decks';
import { FileFactory } from '../file/file';
import { Arguments } from '../types';

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

export const factory: TemplatesFactory = (
  args: Arguments,
  _: Deck,
  cards$: Observable<Card[]>,
  fileFactory: FileFactory,
): Observable<NeedsLayout> => {
  const templateToCards$ = cards$.pipe(map((cards) => gatherTemplates(cards)));

  const templateUpdate$ = templateToCards$.pipe(
    map((templateToCards) => Object.keys(templateToCards)),
    mergeAll(),
    map((template) => fileFactory(args, template)),
    mergeAll(),
  );

  return templateUpdate$.pipe(
    withLatestFrom(templateToCards$),
    map(([templatePaths, templateToCards]) =>
      templateToCards[templatePaths.filePath].map((card) => ({
        templatePaths,
        card,
      })),
    ),
    mergeAll(),
  );
};
