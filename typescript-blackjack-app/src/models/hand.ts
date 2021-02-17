import { Card } from "./card";

export interface Hand {
    cards: Array<Card>,
    bet: number,
    insurance: boolean,
    stayed: boolean,
    doubledDown: boolean
}
