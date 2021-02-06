import React from 'react';
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
  showHit: () => boolean,
  stay: () => void,
  split: () => void,
  showSplit: () => boolean,
  insurance: () => void,
  showInsurance: () => boolean,
  doubleDown: () => void,
  showDoubleDown: () => boolean
}) {
  function getHand(hand: Hand) {
    const sliceIndex = props.showAll ? 0 : 1;
    function getCardBack() {
      if (!props.showAll) {
        return <CardBackComponent />
      } 
    }
    return (
      <>
        { getCardBack() }
        { hand.cards.slice(sliceIndex).map((x,i) => <CardComponent key={i} card={x} />) }
        <div>Bet: ${hand.bet} Money: ${props.money}</div>
        <PlayerControlsComponent 
          hit={() => props.hit(hand)}
          showHit={props.showHit}
          stay={props.stay}
          split={props.split}
          showSplit={props.showSplit}
          insurance={props.insurance}
          showInsurance={props.showInsurance}
          doubleDown={props.doubleDown}
          showDoubleDown={props.showDoubleDown}
        />
      </>
    )
  }
  return (
    <>
      <h1>{props.name}</h1>
      { props.hands.map(h => getHand(h)) }
    </>
  )
}