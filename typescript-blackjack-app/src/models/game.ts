import { Card } from "./card";
import { newDecks, shuffle, deal, getValues } from "./deck";
import Player from "./player";

export interface Game {
    dealer: {cards: Array<Card>};
    players: Array<Player>;
    deck: Array<Card>;
    discard: Array<Card>;
    stays: Map<Player, boolean>;
    minimumBet: number;
    maximumBet: number;
    blackJackPayout: number;
    numberOfSplits: number;
    numberOfDecks: number;
}

export function dealCard(
    deck: Array<Card>, 
    to: Array<Card>, 
    discard: Array<Card>): boolean {

    if(!deal(deck, to)) {
        console.log('Shuffling...');
        deck = discard;
        discard = [];
        if(!deal(deck, to)) {
            console.log("Could not deal card!");
            return false;
        }
    }
    return true;
}

export function newGame(
    players: Array<Player>, 
    minimumBet: number, 
    maximumBet: number, 
    blackJackPayout: number, 
    numberOfSplits: number, 
    numberOfDecks: number
): Game {
    let discard = new Array<Card>();
    let deck = newDecks(numberOfDecks);
    shuffle(deck);
    let dealersHand = new Array<Card>();
    dealCard(deck, dealersHand, discard);
    dealCard(deck, dealersHand, discard);
    for(const player of players) {
        player.hands.length = 1;
        player.hands[0].bet = minimumBet;
        player.money -= minimumBet;
        dealCard(deck, player.hands[0].cards, discard);
        dealCard(deck, player.hands[0].cards, discard);
    }  
    return {
        dealer: {cards: dealersHand},
        players,
        deck,
        discard,
        stays: new Map<Player, boolean>(players.map(p => [p, false])),
        minimumBet,
        maximumBet,
        blackJackPayout,
        numberOfSplits,
        numberOfDecks
    };
}

export function hit(player: Player, game: Game, hand: number = 0) {
    if (!deal(game.deck, player.hands[hand].cards)) {
        game.deck = game.discard;
        game.discard = new Array<Card>();
        if(!deal(game.deck, player.hands[hand].cards)) {
            console.log('hit: Could not deal card');
        }
    }
    // If value exceeds 21 then mark it as a stay
    const valueLessThan21 = Array.from(getValues(player.hands[hand].cards))
        .some(x => x < 21);
    if(!valueLessThan21) {
        game.stays.set(player, true);
    }
}

export function stay(player: Player, game: Game) {
    game.stays.set(player, true);

    if(Array.from(game.stays.values()).every(x => x)) {
        // dealer plays
        let dealerValues = Array.from(getValues(game.dealer.cards))
            .filter(x => x <= 21);
        let dealerMaxValue = dealerValues.length 
            ? dealerValues.reduce((max, x) => x > max ? x : max)
            : 0
        while(dealerValues.length > 0 && dealerMaxValue < 17) {
            deal(game.deck, game.dealer.cards);
            dealerValues = Array.from(getValues(game.dealer.cards))
                .filter(x => x > 21);
            dealerMaxValue = dealerValues.length
                ? dealerValues.reduce((max, x) => x > max ? x : max)
                : 0;
        }
        
        // Pay out bets
        for (const player of game.players) {
            player.hands.forEach(hand => {
                const handValues = Array.from(getValues(hand.cards))
                    .filter(v => v <= 21 && v > dealerMaxValue);
                if (handValues.length) {
                    player.money += hand.bet;
                } 
                hand.bet = 0;
            })
        }
    }
}
