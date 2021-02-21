import { ChangeEvent, useState } from "react";
import { Rules, SurrenderRules } from "../models/game";

const surrenderToString = new Map<SurrenderRules, string>([
    [SurrenderRules.No, "None"],
    [SurrenderRules.Early, "Early"],
    [SurrenderRules.Late, "Late"]

]);

const stringToSurrender = new Map<string, SurrenderRules>([
    ["None", SurrenderRules.No],
    ["Early", SurrenderRules.Early],
    ["Late", SurrenderRules.Late]
]);

export function RulesComponent(props: {rules: Rules, submit: (rules: Rules) => void}) {
    const surrenderRules = surrenderToString.get(props.rules.surrenderRules) as string;
    const [rules, setRules] = useState({...props.rules});
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.submit({
           ...rules,
           surrenderRules: stringToSurrender.get(surrenderRules) as SurrenderRules
        });
    };
    const eventAsInt = (f: (rules: Rules, i: number) => void): ((event: React.FormEvent<HTMLInputElement>) => void) => {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const newRules = {...rules};
            f(newRules, parseInt(event.currentTarget.value));
            setRules(newRules);
        }
    };
    const onMinimumBet = eventAsInt((rules, x) => rules.minimumBet = x);
    const onMaximumBet = eventAsInt((rules, x) => rules.maximumBet = x);
    const onNumberOfDecks = eventAsInt((rules, x) => rules.numberOfDecks = x);
    const onBlackjackPayoutNumerator = eventAsInt((rules, x) => rules.blackJackPayout.numerator = x);
    const onBlackjackPayoutDenominator = eventAsInt((rules, x) => rules.blackJackPayout.denominator = x);
    const onNumberOfSplits = eventAsInt((rules, x) => rules.numberOfSplits = x);
    const onSurrenderRules = (event: ChangeEvent<HTMLSelectElement>) => {
        const newRules = {...rules};
        newRules.surrenderRules = stringToSurrender.get(event.currentTarget.value) as SurrenderRules;
        setRules(newRules);
    };

    return (
        <>
            <h1>Game Rules</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <input type="submit" value="Begin" />
                </div>
                <div>
                    <label>Minimum Bet: <input type="number" step="10" min="0" value={rules.minimumBet} onChange={onMinimumBet}/></label>
                </div>
                <div>
                    <label>Maximum Bet: <input type="number" step="10" min={rules.minimumBet} value={rules.maximumBet} onChange={onMaximumBet}/></label>
                </div>
                <div>
                    <label>Number of Decks: <input type="number" min="1" value={rules.numberOfDecks} onChange={onNumberOfDecks}/></label>
                </div>
                <div>
                    <label>Blackjack Payout: 
                        <input type="number" value={rules.blackJackPayout.numerator} onChange={onBlackjackPayoutNumerator}/> to
                        <input type="number" value={rules.blackJackPayout.denominator} onChange={onBlackjackPayoutDenominator}/>
                    </label> 
                </div>
                <div>
                    <label>Number of Splits: <input type="number" min="0" value={rules.numberOfSplits} onChange={onNumberOfSplits}/></label>
                </div>
                <div>
                    <label>Surrender Rules: 
                        <select onChange={onSurrenderRules}>
                            <option value="None">None</option> 
                            <option value="Early">Early</option>
                            <option value="Late">Late</option>
                        </select>
                    </label>
                </div>
            </form>
        </>
    );
}