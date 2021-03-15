import React, { useEffect, useRef, useState } from "react";

export function PlaceBetComponent(props: {
    onBetChanged: (value: number) => void, 
    bets: {minimum: number, maximum: number},
    previousBet: number,
    money: number
}) {
    const [bet, setBet] = useState(props.previousBet);
    const placeBetButton = useRef<HTMLButtonElement>(null);
    const cowboyEmoji = '\u{1F920}';
    const moneyBagEmoji = '\u{1F4B0}';
    useEffect(() => {
        placeBetButton?.current?.focus();
    },[]);

    const changeBet = (event: React.FormEvent<HTMLInputElement>) => {
        const newBet = parseInt(event.currentTarget.value);
        setBet(newBet);
    };

    const submitBet = (event: React.FormEvent<HTMLButtonElement>) => {
        props.onBetChanged(bet);
    };

    return (
        <>
            <h1>Place Bet</h1>
            <div>
                <span className="card">{cowboyEmoji}</span>
                <span className="card">{moneyBagEmoji}</span>
            </div>
            <div>
                <span className="card">{moneyBagEmoji}</span>
                <span className="card">{cowboyEmoji}</span>
            </div>
            <div>
                <span className="card">{cowboyEmoji}</span>
                <span className="card">{moneyBagEmoji}</span>
            </div>
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
            <button onClick={(event) => submitBet(event)} ref={placeBetButton}>Place Bet</button>
        </>
    );
}