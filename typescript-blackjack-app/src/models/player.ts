import { Card } from './card'

export default interface Player {
  name: string;
  hands: Array<Array<Card>>;
  money: number;
}
