import { Card, Rank, Suit } from './card';
import { newDecks } from './deck';
import { dealCard, Game, GameState, getHandSummary, HandResult, shouldShowSplit, splitHand, stay, SurrenderRules } from './game'
import { newPlayer } from './player';

const createGame = (dealerCards: Array<Card>, playerCards: Array<Card>): Game=> {
    const player = newPlayer("Max", 1000);
    player.hands = [{cards: playerCards, bet: 100, insurance: false, stayed: false, doubledDown: false}]
    const players = [player];
    return {
        dealer: {cards: dealerCards},
        players,
        deck: newDecks(2),
        discard: [],
        state: GameState.Round
    };
};

const createRules = () => {
    return {
        minimumBet: 100,
        maximumBet: 1000,
        blackJackPayout: {numerator: 3, denominator: 2}, 
        numberOfSplits: 1,
        numberOfDecks: 2,
        surrenderRules: SurrenderRules.No
    };
}

describe('getHandSummary', () => {
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
        const rules = createRules();
        const hand = game.players[0].hands[0];

        const newGame = splitHand(game, hand, rules);

        const player = newGame.players[0];
        expect(player.hands.length).toBe(2);
        expect(player.hands[0].cards.some(x => x.rank == Rank.Eight));
        expect(player.hands[1].cards.some(x => x.rank == Rank.Eight));
    });
    test('split should not result in more hands than are permitted', () => {
        const dealerCards: Array<Card> = [{rank: Rank.Ace, suit: Suit.Spades}, {rank: Rank.Queen, suit: Suit.Hearts}];
        const playerCards: Array<Card> = [{rank: Rank.Eight, suit: Suit.Clubs}, {rank: Rank.Eight, suit: Suit.Spades}];
        const game = createGame(dealerCards, playerCards);
        const rules = createRules();
        const hand = game.players[0].hands[0];

        const newGame = splitHand(game, hand, rules);
        const player = newGame.players[0];
        const newNewGame = splitHand(newGame, player.hands[1], rules);
        const newPlayer = newNewGame.players[0];

        expect(newPlayer.hands.length).toBe(2);
    });
    test('staying on all split hands should result in round over', () => {
        const dealerCards: Array<Card> = [{rank: Rank.Ace, suit: Suit.Spades}, {rank: Rank.Queen, suit: Suit.Hearts}];
        const playerCards: Array<Card> = [{rank: Rank.Eight, suit: Suit.Clubs}, {rank: Rank.Eight, suit: Suit.Spades}];
        const game = createGame(dealerCards, playerCards);
        const rules = createRules();
        const hand = game.players[0].hands[0];

        const newGame = splitHand(game, hand, rules);
        newGame.players.forEach(p => p.hands.forEach(h => stay(h, newGame, rules)));

        const player = newGame.players[0];
        expect(newGame.state).toBe(GameState.RoundEnd);
        expect(newGame.players.length).toBe(1);
        expect(newGame.players[0].hands.length).toBe(2);
    });
});
describe('shouldShowSplit', () => {
    test('should not show if the player does not have enough money to split', () => {
        const dealerCards: Array<Card> = [{rank: Rank.Ace, suit: Suit.Spades}, {rank: Rank.Queen, suit: Suit.Hearts}];
        const playerCards: Array<Card> = [{rank: Rank.Eight, suit: Suit.Clubs}, {rank: Rank.Eight, suit: Suit.Spades}];
        const game = createGame(dealerCards, playerCards);
        const hand = game.players[0].hands[0];
        const player = game.players[0];
        player.money = hand.bet - 1;

        const sh = shouldShowSplit(game, hand);

        expect(sh).toBe(false);
    });
})

describe('dealCard', () => {
    test('should deal one card to the appropriate deck', () => {
        let deck = newDecks(1);
        let to: Array<Card> = [];
        let discard: Array<Card> = [];

        [deck, to, discard] = dealCard(deck, to, discard);

        expect(deck.length).toBe(51);
        expect(to.length).toBe(1);
        expect(discard.length).toBe(0);
    });
    test('if no cards left in deck it should shuffle and draw cards from the discard', () => {
        let discard = newDecks(1);
        let to: Array<Card> = [];
        let deck: Array<Card> = [];

        [deck, to, discard] = dealCard(deck, to, discard);

        expect(deck.length).toBe(51);
        expect(to.length).toBe(1);
        expect(discard.length).toBe(0);
    });
});

describe('stay', () => {
    describe('insurance', () => {
        test('if you win the hand you should still deduct insurance', () => {
            const dealerCards: Array<Card> = [{rank: Rank.Ace, suit: Suit.Spades}, {rank: Rank.Six, suit: Suit.Hearts}];
            const playerCards: Array<Card> = [{rank: Rank.Ten, suit: Suit.Clubs}, {rank: Rank.Eight, suit: Suit.Spades}];
            const game = createGame(dealerCards, playerCards);
            const rules = createRules();
            const player = game.players[0];
            const hand = player.hands[0];
            const initiallMoney = player.money;
            hand.insurance = true;
            hand.bet = 100;

            game.players.forEach(p => p.hands.forEach(h => stay(h, game, rules)));
               
            expect(player.money).toBe(initiallMoney + (hand.bet * 2) - (hand.bet / 2));
        });
        test('if you lose the hand but the dealer has 21 you should not lose your bet', () => {
            const dealerCards: Array<Card> = [{rank: Rank.Ace, suit: Suit.Spades}, {rank: Rank.Jack, suit: Suit.Hearts}];
            const playerCards: Array<Card> = [{rank: Rank.Ten, suit: Suit.Clubs}, {rank: Rank.Six, suit: Suit.Spades}];
            const game = createGame(dealerCards, playerCards);
            const rules = createRules();
            const player = game.players[0];
            const hand = player.hands[0];
            const initiallMoney = player.money;
            hand.insurance = true;
            hand.bet = 100;

            game.players.forEach(p => p.hands.forEach(h => stay(h, game, rules)));
               
            expect(player.money).toBe(initiallMoney + hand.bet);
        });
        test('if you lose the hand and you have insurance then you should lose 1.5x your bet', () => {
            const dealerCards: Array<Card> = [{rank: Rank.Ace, suit: Suit.Spades}, {rank: Rank.Nine, suit: Suit.Hearts}];
            const playerCards: Array<Card> = [{rank: Rank.Ten, suit: Suit.Clubs}, {rank: Rank.Six, suit: Suit.Spades}];
            const game = createGame(dealerCards, playerCards);
            const rules = createRules();
            const player = game.players[0];
            const hand = player.hands[0];
            const initiallMoney = player.money;
            hand.insurance = true;
            hand.bet = 100;

            game.players.forEach(p => p.hands.forEach(h => stay(h, game, rules)));
               
            expect(player.money).toBe(initiallMoney - hand.bet - (hand.bet / 2));
        });
        test('if no insurance then make sure bet is correct', () => {
            const dealerCards: Array<Card> = [{rank: Rank.Ace, suit: Suit.Spades}, {rank: Rank.Nine, suit: Suit.Hearts}];
            const playerCards: Array<Card> = [{rank: Rank.Ten, suit: Suit.Clubs}, {rank: Rank.Six, suit: Suit.Spades}];
            const game = createGame(dealerCards, playerCards);
            const rules = createRules();
            const player = game.players[0];
            const hand = player.hands[0];
            const initiallMoney = player.money;
            hand.bet = 100;

            game.players.forEach(p => p.hands.forEach(h => stay(h, game, rules)));
               
            expect(player.money).toBe(initiallMoney - hand.bet);
        });
    });
});
