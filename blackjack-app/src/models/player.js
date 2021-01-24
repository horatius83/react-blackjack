import Deck from './deck.js'

export default class Player {
  constructor(name, deck = null, isPlayer = false, money = 0) {
    this._name = name;
    this._deck = deck ?? new Deck([]);
    this._isPlayer = isPlayer;
    this._money = money;
  }

  get name() {
    return this._name;
  }

  get money() {
    return this._money;
  }

  get deck() {
    if (!this._isPlayer && this._deck.cards.length > 0) {
      this._deck.cards[0].isFaceUp = false;
    }
    return this._deck;
  }
}