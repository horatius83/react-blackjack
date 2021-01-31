import React from 'react';
import { Hand } from '../models/hand';
import { CardBackComponent } from './CardBackComponent';
import { CardComponent } from './CardComponent';

export function HandsComponent(props: {hands: Array<Hand>, name: string, showAll: boolean}) {
  function getHand(hand: Hand) {
    if(props.showAll) {
      return (
        <>
          { hand.cards.map((x,i) => <CardComponent key={i} card={x} />) }
          <div>Bet: ${hand.bet}</div>
        </>
      );
    } else {
      if(hand.cards.length) {
        return (
          <>
            <CardBackComponent />
            {hand.cards.slice(1).map((x,i) => <CardComponent key={i} card={x} />)}
            <div>Bet: ${hand.bet}</div>
          </>
        );
      }
    }
  }
  return (
    <>
      <h1>{props.name}</h1>
      { props.hands.map(h => getHand(h)) }
    </>
  )
}