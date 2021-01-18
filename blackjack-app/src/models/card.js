export const Ranks = {
  'Ace': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': 'A',
  'Jack': 'B',
  'Queen': 'D',
  'King': 'E',
};

export const Suits = {
  'Spades': 'A',
  'Hearts': 'B',
  'Diamonds': 'C',
  'Clubs': 'D'
};

export class Card {
  constructor(rank, suit, isFaceUp = false) {
    this._rank = rank;
    this._suit = suit;
    const rankHex = Ranks[rank];
    const suitHex = Suits[suit];
    const charCodeHex = `1F0${suitHex}${rankHex}`;
    this._unicodeChar = isFaceUp
      ? String.fromCodePoint(parseInt(charCodeHex, 16))
      : '\u{1F0A0}';
    this._color = suit === 'Hearts' || suit === 'Diamonds'
      ? 'red'
      : 'black';
  }

  get rank() { return this._rank; }
  get suit() { return this._suit; }
  get isFaceUp() { return this._isFaceUp; }
  set isFaceUp(isFaceUp) { 
    if (isFaceUp === this._isFaceUp) {
      return;
    }
    this._isFaceUp = isFaceUp;
    if (isFaceUp) {
      const rankHex = Ranks[this._rank];
      const suitHex = Suits[this._suit];
      const charCodeHex = `1F0${suitHex}${rankHex}`;
      this._unicodeChar = String.fromCodePoint(parseInt(charCodeHex, 16));
      this._color = this._suit === 'Hearts' || this._suit === 'Diamonds'
        ? 'red'
        : 'black';
    } else {
      this._unicodeChar = '\u{1F0A0}';
      this._color = 'black';
    }
  }
  get color() { return this._color; }
  get unicodeChar() { return this._unicodeChar; }
}
