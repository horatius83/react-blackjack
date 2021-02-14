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
  stay: (hand: Hand) => void,
  showStay: () => boolean,
  split: (hand: Hand) => void,
  showSplit: (h: Hand) => boolean,
  insurance: () => void,
  showInsurance: () => boolean,
  doubleDown: () => void,
  showDoubleDown: () => boolean
}) {
  function getHand(hand: Hand, index: number) {
    const sliceIndex = props.showAll ? 0 : 1;
    function getCardBack() {
      if (!props.showAll) {
        return <CardBackComponent key={index}/>
      } 
    }
    return (
      <>
        { getCardBack() }
        { hand.cards.slice(sliceIndex).map((x,i) => <CardComponent key={index * 100 + i} card={x} />) }
        <div>Bet: ${hand.bet} Money: ${props.money}</div>
        <PlayerControlsComponent 
          hit={() => props.hit(hand)}
          showHit={props.showHit}
          stay={() => props.stay(hand)}
          showStay={props.showStay}
          split={() => props.split(hand)}
          showSplit={() => props.showSplit(hand)}
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
      { props.hands.map((h,i) => getHand(h, i)) }
    </>
  )
}