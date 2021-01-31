import * as card from './card'

export function newDeck(): Array<card.Card> {
  let cards = new Array<card.Card>();
  for(let rank of card.getRanks()) {
    for(let suit of card.getSuits()) {
      cards.push({rank, suit});
    }
  }
  return cards;
}

export function shuffle(cards: Array<card.Card>): void {
  // My attempt at a Fisher-Yates Shuffle
  if (cards.length > 1) {
    for(let i = cards.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * i);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
}

export function deal(from: Array<card.Card>, to: Array<card.Card>): boolean {
  const card = from.pop();
  if(card != undefined) {
    to.push(card);
    return true;
  } 
  return false;
}

export function getValues(cards: Array<card.Card>): Set<number> {
  function f(cards: Array<card.Card>, index: number): Set<number> {
    if(!cards.length || index >= cards.length) {
      return new Set<number>([0]);
    }
    const allValues = new Set<number>();
    const firstCard = cards[index];
    for (const v of card.getValues(firstCard)) {
      const values = f(cards, index + 1);
      allValues.forEach(vv => allValues.add(v + vv))
    }
    return allValues;
  }
  return f(cards, 0);
}