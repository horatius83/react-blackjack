import React from 'react';
import { HandResult } from '../models/game';
import { Hand } from '../models/hand';
import { CardBackComponent } from './CardBackComponent';
import { CardComponent } from './CardComponent';
import { PlayerControlsComponent } from './PlayerControlsComponent';

export function HandsComponent(props: {
  hands: Array<Hand>, 
  name: string, 
  showAll: boolean,
  money: number,
  hit: (hand: Hand) => void, 
  showHit: (hand: Hand) => boolean,
  stay: (hand: Hand) => void,
  showStay: (hand: Hand) => boolean,
  split: (hand: Hand) => void,
  showSplit: (h: Hand) => boolean,
  insurance: (h: Hand) => void,
  showInsurance: (hand: Hand) => boolean,
  doubleDown: () => void,
  showDoubleDown: (hand: Hand) => boolean,
  showHandSummaries: () => boolean,
  handSummary: (h: Hand) => HandResult
}) {
  function getHand(hand: Hand, index: number) {
    const sliceIndex = props.showAll ? 0 : 1;
    function getCardBack() {
      if (!props.showAll) {
        return <CardBackComponent key={index}/>
      } 
    }
    const handResultToStringMapping = new Map<HandResult, string>([
      [HandResult.Bust, 'Busted'],
      [HandResult.Loss, 'Lost'],
      [HandResult.Push, 'Pushed'],
      [HandResult.Win, 'Won!']
    ]);
    function displayHandSummary(hand: Hand) {
      if(props.showHandSummaries()) {
        const summary = handResultToStringMapping.get(props.handSummary(hand));
        return (
          <div>
            <b>{summary}</b>
          </div>
        )
      } else {
        return null;
      }
    }
    return (
      <>
        {displayHandSummary(hand)}
        { getCardBack() }
        { hand.cards.slice(sliceIndex).map((x,i) => <CardComponent key={index * 100 + i} card={x} />) }
        <div>Bet: ${hand.bet} Money: ${props.money}</div>
        <PlayerControlsComponent 
          hit={() => props.hit(hand)}
          showHit={() => props.showHit(hand)}
          stay={() => props.stay(hand)}
          showStay={() => props.showStay(hand)}
          split={() => props.split(hand)}
          showSplit={() => props.showSplit(hand)}
          insurance={() => props.insurance(hand)}
          showInsurance={() => props.showInsurance(hand)}
          doubleDown={props.doubleDown}
          showDoubleDown={() => props.showDoubleDown(hand)}
        />
      </>
    )
  }
  return (
    <>
      <h1>{props.name}</h1>
      { props.hands.map((h,i) => getHand(h, i)) }
    </>
  )
}