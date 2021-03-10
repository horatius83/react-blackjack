import { Card } from "./card";

export interface Hand {
    cards: Array<Card>,
    bet: number,
    insurance: boolean,
    stayed: boolean,
    doubledDown: boolean
}

export const createHand = (cards: Array<Card>, bet: number): Hand => {
    return {
        cards,
        bet,
        insurance: false,
        stayed: false,
        doubledDown: false
    }
}