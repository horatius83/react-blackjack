import Deck from './deck'

export default class Player {
  constructor(private _name: string, private _deck: Deck = new Deck(), public money = 0) {
  }

  get name() {
    return this._name;
  }

  get deck() {
    return this._deck;
  }
}