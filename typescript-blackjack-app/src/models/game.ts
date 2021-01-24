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

    startRound() {
        
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