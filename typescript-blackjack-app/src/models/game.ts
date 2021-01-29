import { Card } from "./card";
import { newDeck, shuffle, deal } from "./deck";
import Player from "./player";

export interface Game {
    dealer: {cards: Array<Card>};
    players: Array<Player>;
    deck: Array<Card>;
    discard: Array<Card>;
    bets: Map<Player, number>;
    stays: Map<Player, boolean>;
}

export function newGame(players: Array<Player>): Game {
    let deck = newDeck();
    shuffle(deck);
    let dealersHand = new Array<Card>();
    deal(deck, dealersHand);
    deal(deck, dealersHand);
    for(const player of players) {
        deal(deck, player.hands[0]);
        deal(deck, player.hands[0]);
    }  
    return {
        dealer: {cards: dealersHand},
        players,
        deck,
        discard: new Array<Card>(),
        bets: new Map<Player, number>(players.map(p => [p, 100])),
        stays: new Map<Player, boolean>(players.map(p => [p, false]))
    };
}

export function hit(player: Player, game: Game, hand: number = 0) {
    if (!deal(game.deck, player.hands[hand])) {
        game.deck = game.discard;
        game.discard = new Array<Card>();
        if(!deal(game.deck, player.hands[hand])) {
            console.log('hit: Could not deal card');
        }
    }
}

export function stay(player: Player, game: Game) {
    game.stays.set(player, true);

    if([...game.stays.values()].every(x => x)) {
        /// %$#$@ iterators
    }
}
