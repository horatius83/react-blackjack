import { Card, Rank } from "./card";
import { newDecks, getValues, dealImmutable, shuffleImmutable } from "./deck";
import { Hand } from "./hand";
import Player from "./player";

export enum SurrenderRules {
  No,
  Early,
  Late
};

export interface Rules {
  minimumBet: number;
  maximumBet: number;
  blackJackPayout: {numerator: number, denominator: number}; // 3:2 = {numerator: 3, denominator: 2}
  numberOfSplits: number;
  numberOfDecks: number;
  surrenderRules: SurrenderRules;
}

export enum GameState {
  Init,
  Round,
  RoundEnd,
  GameOver
};

export interface Game {
    dealer: {cards: Array<Card>};
    players: Array<Player>;
    deck: Array<Card>;
    discard: Array<Card>;
    state: GameState;
}

export function dealCard(
    deck: Array<Card>, 
    to: Array<Card>, 
    discard: Array<Card>): [Array<Card>, Array<Card>, Array<Card>] {

    if(deck.length) {
      const [newDeck, newTo] = dealImmutable(deck, to);
      return [newDeck, newTo, discard];
    } else {
      const [newDeck, newTo] = dealImmutable(shuffleImmutable(discard), to);
      return [newDeck, newTo, []];
    }
}

export function dealCards(deck: Array<Card>, to: Array<Card>, discard: Array<Card>, cards: number): 
  [Array<Card>, Array<Card>, Array<Card>] {

    let newDeck = [...deck];
    let newTo = [...to];
    let newDiscard = [...discard];

    for(let i=0; i<cards; i++) {
      [newDeck, newTo, newDiscard] = dealCard(newDeck, newTo, newDiscard);
    }
    return [newDeck, newTo, newDiscard];
}

export function newGame(
    players: Array<Player>,
    rules: Rules
): Game {
    let [deck, dealersHand, discard] = dealCards(shuffleImmutable(newDecks(rules.numberOfDecks)), [], [], 2);
    for(const player of players) {
        player.hands.length = 1;
        player.hands[0].bet = rules.minimumBet;
        player.money -= rules.minimumBet;
       [deck, player.hands[0].cards, discard] = dealCards(deck, [], discard, 2);
    }  
    return {
        dealer: {cards: dealersHand},
        players,
        deck,
        discard,
        state: GameState.Init
    };
}

export const showHit = (game: Game, hand: Hand) => {
  return game.state !== GameState.RoundEnd
    && !hand.stayed
    && !hand.doubledDown;
}

export function hit(game: Game, hand: Hand, rules: Rules) {
    [game.deck, hand.cards, game.discard] = dealCard(game.deck, hand.cards, game.discard);
    // If value exceeds 21 then mark it as a stay
    const allValues = Array.from(getValues(hand.cards));
    const valueLessThanOrEqualTo21 = allValues.some(x => x <= 21);
    if(!valueLessThanOrEqualTo21) {
        stay(hand, game, rules);
    }
}

export function haveAllPlayersStayed(game: Game): boolean {
  const f = (b: boolean, h: Hand) => b && h.stayed;
  const g = (b: boolean, p: Player) => b && p.hands.reduce(f, true);
  return game.players.reduce(g, true);
}

export function stay(hand: Hand, game: Game, rules: Rules) {
    hand.stayed = true;

    if(haveAllPlayersStayed(game)) {
        // dealer plays
        let dealerValues = Array.from(getValues(game.dealer.cards))
            .filter(x => x <= 21);
        let dealerMaxValue = dealerValues.length 
            ? dealerValues.reduce((max, x) => x > max ? x : max)
            : 0
        while(dealerValues.length > 0 && dealerMaxValue < 17) {
            [game.deck, game.dealer.cards, game.discard] = dealCard(game.deck, game.dealer.cards, game.discard);
            dealerValues = Array.from(getValues(game.dealer.cards))
                .filter(x => x <= 21);
            dealerMaxValue = dealerValues.length
                ? dealerValues.reduce((max, x) => x > max ? x : max)
                : 0;
        }
        
        // Pay out bets
        for (const player of game.players) {
            player.hands.forEach(hand => {
                console.log(`Player: ${player.name} $${player.money}`);
                const handValues = Array.from(getValues(hand.cards));
                if (handValues.some(x => x <= 21 && x > dealerMaxValue)) {
                    player.money += hand.bet * 2;
                } else if(handValues.some(x => x <= 21 && x === dealerMaxValue)) {
                    player.money += hand.bet;
                }
                // check insurance
                if (hand.insurance 
                  && game.dealer.cards.length === 2
                  && game.dealer.cards.some(x => x.rank === Rank.Ace)
                  && game.dealer.cards.some(x => tenCards.has(x.rank))
                ) {
                  player.money += hand.bet;
                }
                hand.insurance = false;
                player.money -= hand.bet;
                console.log(`Player: ${player.name} $${player.money}`);
            })
        }
        // round end
        game.state = GameState.RoundEnd;
    }
}

const tenCards = new Set<Rank>([Rank.Ten, Rank.Jack, Rank.Queen, Rank.King]);

export function hasBlackjack(dealer: Array<Card>, cards: Array<Card>) {
    // If the dealer is not showing an Ace or 10-card and player has a Ace and a 10-card
    return dealer.length === 2
        && !(dealer[1].rank === Rank.Ace || tenCards.has(dealer[1].rank))
        && cards.length === 2 
        && cards.some(x => x.rank === Rank.Ace)
        && cards.some(c => tenCards.has(c.rank));
}

export enum HandResult {
  Win,
  Bust,
  Push,
  Loss
};

export const getHandSummary = (game: Game, hand: Hand): HandResult => {
  const dealerHandValues = Array.from(getValues(game.dealer.cards))
    .filter(v => v <= 21);
  const playerHandValues = Array.from(getValues(hand.cards))
    .filter(v => v <= 21);
  if (playerHandValues.length === 0) {
    return HandResult.Bust;
  }
  if(dealerHandValues.length === 0) {
    return HandResult.Win;
  } 
  const dealerMaxValue = dealerHandValues.reduce((g, x) => x > g ? x : g);
  const playerMaxValue = playerHandValues.reduce((g, x) => x > g ? x : g);
  if(playerMaxValue > dealerMaxValue) {
    return HandResult.Win;
  } else if (playerMaxValue === dealerMaxValue) {
    return HandResult.Push;
  } else {
    return HandResult.Loss;
  }
}

export const newRound = (oldGame: Game, rules: Rules, setGame: (game: React.SetStateAction<Game>) => void) => {
  console.log('newRound');
  let game = {...oldGame}; 
  [game.dealer.cards, game.discard, game.deck] = dealCards(game.dealer.cards, game.discard, game.deck, game.dealer.cards.length);
  [game.deck, game.dealer.cards, game.discard] = dealCards(game.deck, game.dealer.cards, game.discard, 2);
  for (const player of game.players) {
      for(const hand of player.hands) {
          game.discard = [...game.discard, ...hand.cards];
      }
      const bet = player.hands[0].bet;
      player.hands = [{cards: [], bet, insurance: false, stayed: false, doubledDown: false}];
      // deal new cards
     [game.deck, player.hands[0].cards, game.discard] = dealCards(game.deck, player.hands[0].cards, game.discard, 2);
  }
  const playersWithBlackjacks = game.players.filter(p => hasBlackjack(game.dealer.cards, p.hands[0].cards));
  if(playersWithBlackjacks.length > 0) {
    playersWithBlackjacks.forEach(p => {
      p.money += p.hands[0].bet * (rules.blackJackPayout.numerator / rules.blackJackPayout.denominator);
    });
    game.state = GameState.RoundEnd;
  } else {
    game.state = GameState.Round;
  }
  setGame(game);
};

export const shouldShowInsurance = (game: Game, hand: Hand) => {
  return !hand.insurance && !hand.stayed && game.state === GameState.RoundEnd  && game.dealer.cards.length === 2 && game.dealer.cards[1].rank === Rank.Ace 
}

export const insurance = (hand: Hand) => {
  hand.insurance = true;
}

export const shouldShowSplit = (game: Game, hand: Hand) => {
  return !hand.stayed && game.state === GameState.Round && hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank;
}

export const splitHand = (game: Game, hand: Hand, rules: Rules): Game => {
  if(hand.cards.length !== 2) {
    return game;
  }
  // find the player that has this hand
  const players = game.players.filter(p => p.hands.some(h => h === hand));
  if (!players) {
    console.log('Could not find player');
    return game;
  }
  const player = players[0];
  if(player.hands.length > rules.numberOfSplits) {
    console.log('Could not split anymore');
    return game;
  }
  const handIndex = player.hands.indexOf(hand);
  // split the hand in two
  const hand1: Hand = {...hand, cards: [hand.cards[0]] };
  const hand2: Hand = {...hand, cards: [hand.cards[1]] };
  // deal cards
  [game.deck, hand1.cards, game.discard] = dealCard(game.deck, hand1.cards, game.discard);
  [game.deck, hand2.cards, game.discard] = dealCard(game.deck, hand2.cards, game.discard);
  const newHands = [...player.hands.splice(0,handIndex), ...player.hands.splice(handIndex+1), hand1, hand2];
  player.hands = newHands;
  const playerIndex = players.indexOf(player);
  const newPlayers = [...players.splice(0, playerIndex), ...players.splice(playerIndex + 1), player];
  return {...game, players: newPlayers};
}

export const split = (oldGame: Game, hand: Hand, rules: Rules, setGame: (game: React.SetStateAction<Game>) => void) => {
  let game = splitHand({...oldGame}, hand, rules);
  setGame(game);
}

export const shouldShowDoubleDown = (game: Game, hand: Hand) => !hand.stayed && !hand.doubledDown && game.state === GameState.Round;

export const doubleDown = (game: Game, hand: Hand, rules: Rules) => {
  console.log('doubleDown');
  hit(game, hand, rules);
  hand.doubledDown = true;
  if(!hand.stayed) {
    stay(hand, game, rules);
  }
};

export const shouldShowStay = (game: Game, hand: Hand) => !hand.stayed && game.state === GameState.Round;