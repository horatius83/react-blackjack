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

const rankValueMap = new Map<Rank, Array<number>>([
    [Rank.Ace, [1, 11]],
    [Rank.Two, [2]],
    [Rank.Three, [3]],
    [Rank.Four, [4]],
    [Rank.Five, [5]],
    [Rank.Six, [6]],
    [Rank.Seven, [7]],
    [Rank.Eight, [8]],
    [Rank.Nine, [9]],
    [Rank.Ten, [10]],
    [Rank.Jack, [10]],
    [Rank.Queen, [10]],
    [Rank.King, [10]]
]) 

const suitHexMap = new Map<Suit, string>([
    [Suit.Spades, 'A'],
    [Suit.Hearts, 'B'],
    [Suit.Diamonds, 'C'],
    [Suit.Clubs, 'D']
]);

export const SuitBackUnicodeChar = '\u{1F0A0}';

export interface Card {
    rank: Rank;
    suit: Suit;
}

export function getUnicodeChar(card: Card): string {
    const rankHex = rankHexMap.get(card.rank);
    const suitHex = suitHexMap.get(card.suit);
    const charCodeHex = `1F0${suitHex}${rankHex}`;
    return String.fromCodePoint(parseInt(charCodeHex, 16))
}

export function getColor(card: Card): string {
    return card.suit === Suit.Hearts || card.suit === Suit.Diamonds
        ? 'red'
        : 'black';
}