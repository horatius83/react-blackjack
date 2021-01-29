import { Card } from './card'

export default interface Player {
  name: string;
  hands: Array<Array<Card>>;
  money: number;
}

export function newPlayer(name: string, money: number): Player {
  return {
    name,
    money,
    hands: [new Array<Card>()]
  }
}
