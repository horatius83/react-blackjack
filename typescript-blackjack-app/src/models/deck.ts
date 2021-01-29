import {Rank, Suit, Card} from './card'

export function newDeck(): Array<Card> {
    let cards = new Array<Card>();
    for(let rankKey in Rank) {
        const rank = Rank[rankKey as keyof typeof Rank];
        for(let suit in Suit) {
            cards.push({rank, suit: Suit[suit as keyof typeof Suit]})
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

export function deal(deckFrom: Array<Card>, deckTo: Array<Card>): boolean {
  const card = deckFrom.pop();
  if(card != undefined) {
    deckTo.push(card);
    return true;
  } 
  return false;
}
