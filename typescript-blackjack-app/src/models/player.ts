import { Card } from './card'
import { Hand } from './hand'

export default interface Player {
  name: string;
  hands: Array<Hand>;
  money: number;
}

export function newPlayer(name: string, money: number): Player {
  return {
    name,
    money,
    hands: [{cards: new Array<Card>(), bet: 0, insurance: false, stayed: false}]
  }
}
