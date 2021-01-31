export enum Rank 
{
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

interface RankInfo {
    hex: string,
    values: Array<number>
}

const rankMap = new Map<Rank, RankInfo>([
    [Rank.Ace, {hex: '1', values: [1, 11]}],
    [Rank.Two, {hex: '2', values: [2]}],
    [Rank.Three, {hex: '3', values: [3]}],
    [Rank.Four, {hex: '4', values: [4]}],
    [Rank.Five, {hex: '5', values: [5]}],
    [Rank.Six, {hex: '6', values: [6]}],
    [Rank.Seven, {hex: '7', values: [7]}],
    [Rank.Eight, {hex: '8', values: [8]}],
    [Rank.Nine, {hex: '9', values: [9]}],
    [Rank.Ten, {hex: 'A', values: [10]}],
    [Rank.Jack, {hex: 'B', values: [10]}],
    [Rank.Queen, {hex: 'D', values: [10]}],
    [Rank.King, {hex: 'E', values: [10]}]
]);

export function getRanks(): Array<Rank> {
    return Array.from(rankMap.keys());
}

export enum Suit {
    Spades,
    Hearts,
    Diamonds,
    Clubs 
};

interface SuitInfo {
    hex: string,
    color: string
}

const suitMap = new Map<Suit, SuitInfo>([
    [Suit.Spades, {hex: 'A', color: 'black'}],
    [Suit.Hearts, {hex: 'B', color: 'red'}],
    [Suit.Diamonds, {hex: 'C', color: 'red'}],
    [Suit.Clubs, {hex: 'D', color: 'black'}]
]);

export function getSuits(): Array<Suit> {
    return Array.from(suitMap.keys());
}

export const SuitBackUnicodeChar = '\u{1F0A0}';

export interface Card {
    rank: Rank;
    suit: Suit;
}

export function getUnicodeChar(card: Card): string {
    const rankHex = rankMap.get(card.rank)?.hex;
    const suitHex = suitMap.get(card.suit)?.hex;
    const charCodeHex = `1F0${suitHex}${rankHex}`;
    return String.fromCodePoint(parseInt(charCodeHex, 16))
}

export function getColor(card: Card): string {
    return suitMap.get(card.suit)?.color as string;
}

export function getValues(card: Card): Array<number> {
    return rankMap.get(card.rank)?.values as Array<number>;
}