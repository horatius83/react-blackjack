import { Card, Rank, Suit } from './card';
import { newDecks } from './deck';
import { Game, getHandSummary, HandResult, splitHand } from './game'
import { Hand } from './hand';
import { newPlayer } from './player';

const createGame = (dealerCards: Array<Card>, playerCards: Array<Card>): Game=> {
    const player = newPlayer("Max", 100);
    player.hands = [{cards: playerCards, bet: 100, insurance: false}]
    const players = [player];
    return {
        dealer: {cards: dealerCards},
        players,
        deck: newDecks(2),
        discard: [],
        stays: new Map<Hand, boolean>(players.reduce((xs, p) => xs.concat(p.hands.map(h => [h, false])), new Array<[Hand, boolean]>())),
        rules: {
            minimumBet: 10,
            maximumBet: 100,
            blackJackPayout: 3/2,
            numberOfSplits: 1,
            numberOfDecks: 2
        },
        isRoundOver: false
    };
};

describe('getRoundsummary', () => {
    test('pushes greater than 21 do not count', () => {
        const ranks = [Rank.Jack, Rank.Queen, Rank.King];
        const playerCards: Array<Card> = ranks.map(r => {return {rank: r, suit: Suit.Hearts}});
        const dealerCards: Array<Card> = ranks.map(r => {return {rank: r, suit: Suit.Diamonds}});
        const game = createGame(dealerCards, playerCards);

        const result = getHandSummary(game, game.players[0].hands[0]);

        expect(result).toBe(HandResult.Bust);
    });
});

describe('splitHand', () => {
    test('split one hand should result in two hands', () => {
        const dealerCards: Array<Card> = [{rank: Rank.Ace, suit: Suit.Spades}, {rank: Rank.Queen, suit: Suit.Hearts}];
        const playerCards: Array<Card> = [{rank: Rank.Eight, suit: Suit.Clubs}, {rank: Rank.Eight, suit: Suit.Spades}];
        const game = createGame(dealerCards, playerCards);
        const hand = game.players[0].hands[0];

        const newGame = splitHand(game, hand);

        const player = newGame.players[0];
        expect(player.hands.length).toBe(2);
        expect(player.hands[0].cards.some(x => x.rank == Rank.Eight));
        expect(player.hands[1].cards.some(x => x.rank == Rank.Eight));
    });
    test('split should not result in more hands than are permitted', () => {
        const dealerCards: Array<Card> = [{rank: Rank.Ace, suit: Suit.Spades}, {rank: Rank.Queen, suit: Suit.Hearts}];
        const playerCards: Array<Card> = [{rank: Rank.Eight, suit: Suit.Clubs}, {rank: Rank.Eight, suit: Suit.Spades}];
        const game = createGame(dealerCards, playerCards);
        const hand = game.players[0].hands[0];

        const newGame = splitHand(game, hand);
        const player = newGame.players[0];
        const newNewGame = splitHand(newGame, player.hands[1]);
        const newPlayer = newNewGame.players[0];

        expect(newPlayer.hands.length).toBe(2);
    });
});
