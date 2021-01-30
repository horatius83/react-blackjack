import {Card, getRanks, getSuits} from './card'

export function newDeck(): Array<Card> {
  let cards = new Array<Card>();
  for(let rank of getRanks()) {
    for(let suit of getSuits()) {
      cards.push({rank, suit});
    }
  }
  return cards;
}

export function shuffle(cards: Array<Card>): void {
  // My attempt at a Fisher-Yates Shuffle
  if (cards.length > 1) {
    for(let i = cards.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * i);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
}

export function deal(from: Array<Card>, to: Array<Card>): boolean {
  const card = from.pop();
  if(card != undefined) {
    to.push(card);
    return true;
  } 
  return false;
}
