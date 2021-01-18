import {Ranks, Suits, Card} from './card.js'

export default class Deck {
  constructor(cards) {
      if (!cards) {
        this._cards = [];
        for(let rank of Object.keys(Ranks)) {
            for(let suit of Object.keys(Suits)) {
                this._cards.push(new Card(rank, suit, true));
            }
        }
      } else {
        this._cards = cards;
      }
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
    let acc = [];
    if (this.cards.length <= count) {
      acc = this._cards;
      this._cards.length = 0;
    }
    for(let i=0;i<count;i++) {
      acc.push(this._cards.pop());
    }
    return acc;
  }

  addCards(cards) {
    for (let card of this._cards) {
      this._cards.push(card);
    }        
  }

  get cards() {
    return this._cards;
  }
}