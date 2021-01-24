import {Rank, Suit, Card} from './card'

export function newDeck(): Deck {
    let cards = new Array<Card>();
    for(let rankKey in Rank) {
        const rank = Rank[rankKey as keyof typeof Rank];
        for(let suit in Suit) {
            cards.push(new Card(rank, Suit[suit as keyof typeof Suit]));
        }
    }
    return new Deck(cards);
}

export default class Deck {
  constructor(private _cards: Array<Card> = new Array<Card>()) {
  }

  shuffle() {
    // My attempt at a Fisher-Yates Shuffle
    if (this._cards?.length > 1) {
      for(let i = this._cards.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * i);
        [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
      }
    }
  }

  deal(count = 1) {
    if (count < 1) {
      return [];
    }
    let acc = new Array<Card>();
    if (this.cards.length <= count) {
      acc = this._cards;
      this._cards.length = 0;
    }
    for(let i=0;i<count;i++) {
        const card = this._cards.pop();
        if(card) {
            acc.push(card as Card);
        }
    }
    return acc;
  }

  addCards(cards: Array<Card>) {
    for (let card of cards) {
      this._cards.push(card);
    }        
  }

  get cards() {
    return this._cards;
  }
}