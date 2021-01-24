export enum Rank {
    Ace,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King
};

export enum Suit {
    Spades,
    Hearts,
    Diamonds,
    Clubs 
};

const rankHexMap = new Map<Rank, string>([
    [Rank.Ace, '1'],
    [Rank.Two, '2'],
    [Rank.Three, '3'],
    [Rank.Four, '4'],
    [Rank.Five, '5'],
    [Rank.Six, '6'],
    [Rank.Seven, '7'],
    [Rank.Eight, '8'],
    [Rank.Nine, '9'],
    [Rank.Ten, 'A'],
    [Rank.Jack, 'B'],
    [Rank.Queen, 'D'],
    [Rank.King, 'E']
]);

const suitHexMap = new Map<Suit, string>([
    [Suit.Spades, 'A'],
    [Suit.Hearts, 'B'],
    [Suit.Diamonds, 'C'],
    [Suit.Clubs, 'D']
]);

export const SuitBackUnicodeChar = '\u{1F0A0}';

export class Card {
    private _unicodeChar: string;
    private _color: string;

    constructor(private _rank: Rank, private _suit: Suit) {
        const rankHex = rankHexMap.get(_rank);
        const suitHex = suitHexMap.get(_suit);
        const charCodeHex = `1F0${suitHex}${rankHex}`;
        this._unicodeChar = String.fromCodePoint(parseInt(charCodeHex, 16))
        this._color = _suit === Suit.Hearts || _suit === Suit.Diamonds
            ? 'red'
            : 'black';
  }
  
  get rank() { return this._rank; }
  get suit() { return this._suit; }
  get color() { return this._color; }
  get unicodeChar() { return this._unicodeChar; }
}
