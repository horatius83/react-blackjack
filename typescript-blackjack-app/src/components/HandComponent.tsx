import React from 'react';
import Player from '../models/player';
import { CardComponent } from './CardComponent';

export function HandComponent(props: {player: Player}) {
  return (
    <>
      <h1>{props.player.name}</h1>
      {props.player.deck.cards.map((x,i) => <CardComponent key={i} card={x} />)}
    </>
  )
}