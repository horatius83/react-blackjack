import React from 'react';
import Player from '../models/player';
import { CardBackComponent } from './CardBackComponent';
import { CardComponent } from './CardComponent';

export function HandComponent(props: {player: Player, showAll: boolean}) {
  function getHand() {
    if(props.showAll) {
      return props.player.deck.cards.map((x,i) => <CardComponent key={i} card={x} />)
    } else {
      if(props.player.deck.cards.length) {
        return (
          <>
            <CardBackComponent />
            {props.player.deck.cards.slice(1).map((x,i) => <CardComponent key={i} card={x} />)}
          </>
        );
      }
    }
  }
  return (
    <>
      <h1>{props.player.name}</h1>
      {getHand()}
    </>
  )
}