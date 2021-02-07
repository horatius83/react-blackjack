import React from 'react';
import { Card } from '../models/card';
import { CardBackComponent } from './CardBackComponent';
import { CardComponent } from './CardComponent';

export function DealerComponent(props: {cards: Array<Card>, showAll: boolean}) {
  function getHand() {
        if(props.cards.length) {
          if(!props.showAll) {
            return (
                <>
                <CardBackComponent />
                {props.cards.slice(1).map((x,i) => <CardComponent key={i} card={x} />)}
                </>
            );
          } else {
            return (
                <>
                {props.cards.map((x,i) => <CardComponent key={i} card={x} />)}
                </>
            );
          }
            
        }
    }
  return (
    <>
      <h1>Dealer</h1>
      {getHand()}
    </>
  )
}