import React from 'react';
import { Card } from '../models/card';
import { CardBackComponent } from './CardBackComponent';
import { CardComponent } from './CardComponent';

export function HandComponent(props: {hand: Array<Card>, name: string, showAll: boolean}) {
  function getHand() {
    if(props.showAll) {
      return props.hand.map((x,i) => <CardComponent key={i} card={x} />)
    } else {
      if(props.hand.length) {
        return (
          <>
            <CardBackComponent />
            {props.hand.slice(1).map((x,i) => <CardComponent key={i} card={x} />)}
          </>
        );
      }
    }
  }
  return (
    <>
      <h1>{props.name}</h1>
      {getHand()}
    </>
  )
}