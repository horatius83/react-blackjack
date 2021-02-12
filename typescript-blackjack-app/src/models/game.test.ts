import { Card, Rank, Suit } from './card';
import { newDecks } from './deck';
import { Game, getRoundSummary } from './game'
import Player, { newPlayer } from './player';

describe('getRoundsummary', () => {
    const createGame = (dealerCards: Array<Card>, playerCards: Array<Card>) => {
        const player = newPlayer("Max", 100);
        player.hands = [{cards: playerCards, bet: 100, insurance: false}]
        const players = [player];
        return {
            dealer: {cards: dealerCards},
            players,
            deck: newDecks(2),
            discard: [],
            stays: new Map<Player, boolean>(players.map(p => [p, false])),
            rules: {
                minimumBet: 10,
                maximumBet: 100,
                blackJackPayout: 3/2,
                numberOfSplits: 2,
                numberOfDecks: 2
            },
            isRoundOver: false
        };
    };
    test('pushes greater than 21 do not count', () => {
        const ranks = [Rank.Jack, Rank.Queen, Rank.King];
        const playerCards: Array<Card> = ranks.map(r => {return {rank: r, suit: Suit.Hearts}});
        const dealerCards: Array<Card> = ranks.map(r => {return {rank: r, suit: Suit.Diamonds}});
        const game = createGame(dealerCards, playerCards);

        const result = getRoundSummary(game);

        expect(result).toBe("Both Busted");
    });
})
