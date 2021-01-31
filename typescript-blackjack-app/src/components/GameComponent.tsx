import React, { useState } from 'react';
import * as blackjack from '../models/game';
import Player from '../models/player';
import { HandsComponent } from './HandsComponent';
import { PlayerControlsComponent } from './PlayerControlsComponent';
import { DealerComponent } from './DealerComponent';

export function GameComponent(props: {game: blackjack.Game}) {
  const [game, setGame] = useState(props.game);

  const hit = () => {
    console.log('hit');
    let newGame = {...game}; 
    // Need a way for different players to hit
    blackjack.hit(game.players[0], newGame);
    setGame(newGame);
  };
  const stay = () => {
    console.log('stay');
  };
  const split = () => {
    console.log('split')
  };
  const insurance = () => {
    console.log('insurance');
  };
  const doubleDown = () => {
    console.log('doubleDown');
  };

  return (
    <div className="game">
      <DealerComponent  cards={props.game.dealer.cards} />
      <HandsComponent name={props.game.players[0].name} hands={props.game.players[0].hands} showAll={true}/>
      <PlayerControlsComponent 
        hit={hit}     
        stay={stay}
        split={split}
        insurance={insurance}
        doubleDown={doubleDown}
      />
    </div>
  );
}