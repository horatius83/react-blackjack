import Deck from "./deck";
import Player from "./player";

export class Game {
    private _discard = new Deck();

    constructor(private _dealer: Player, private _player: Player, private _otherPlayers: Array<Player>, private _deck: Deck) {
    }

    get dealer() {
        return this._dealer;
    }

    get player() {
        return this._player;
    }

    get otherPlayers() {
        return this._otherPlayers;
    }

    dealTo(player: Player) {
        if (!this._dealer.deck.cards.length) {
            this._dealer.deck.addCards(this._discard.cards);
            this._dealer.deck.shuffle();
            this._discard.cards.length = 0;
        }
        if(!this._deck.cards.length) {
            this._deck.addCards(this._discard.cards);
            this._deck.shuffle();
            this._discard.cards.length = 0;
        }
        player.deck.addCards(this._deck.deal(1));
    }

    startRound() {
        // Deal cards        
        this.dealTo(this._player);
        this.dealTo(this._dealer);
        this.dealTo(this._player);
        this.dealTo(this._dealer);
    }

    hit() {

    }

    stay() {

    }

    split() {

    }

    insurance() {

    }

    doubleDown() {

    }
}