import Deck from './deck.js'

export default class Player {
  constructor(name, deck = null, isPlayer = false) {
    this._name = name;
    this._deck = deck ?? new Deck([]);
    this._isPlayer = isPlayer;
  }

  get name() {
    return this._name;
  }

  get deck() {
    if (!this._isPlayer && this._deck.cards.length > 0) {
      this._deck.cards[0].isFaceUp = false;
    }
    return this._deck;
  }

  dealTo(otherDeck, count) {
    
  }
}