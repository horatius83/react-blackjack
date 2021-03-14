import React, { useState } from "react";

export function PlaceBetComponent(props: {
    onBetChanged: (value: number) => void, 
    bets: {minimum: number, maximum: number},
    previousBet: number,
    money: number
}) {
    const [bet, setBet] = useState(props.previousBet);

    const changeBet = (event: React.FormEvent<HTMLInputElement>) => {
        const newBet = parseInt(event.currentTarget.value);
        setBet(newBet);
    };

    const submitBet = (event: React.FormEvent<HTMLButtonElement>) => {
console.log('PlaceBetComponent: submitBet');
        props.onBetChanged(bet);
    };

    return (
        <>
            <h1>Place Bet</h1>
            <div>Bet: $
                <input 
                type="number" 
                min={props.bets.minimum} 
                max={Math.min(props.bets.maximum, props.money)} 
                value={bet} 
                step={10}
                onChange={(event) => changeBet(event)}
                ></input> 
            Money: ${props.money}</div>
            <button onClick={(event) => submitBet(event)}>Place Bet</button>
        </>
    );
}