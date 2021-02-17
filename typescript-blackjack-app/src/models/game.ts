import { Card, Rank } from "./card";
import { newDecks, getValues, dealImmutable, shuffleImmutable } from "./deck";
import { Hand } from "./hand";
import Player from "./player";

export interface Rules {
  minimumBet: number;
  maximumBet: number;
  blackJackPayout: number;
  numberOfSplits: number;
  numberOfDecks: number;
}

export interface Game {
    dealer: {cards: Array<Card>};
    players: Array<Player>;
    deck: Array<Card>;
    discard: Array<Card>;
    isRoundOver: boolean;
    rules: Rules;
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
    minimumBet: number, 
    maximumBet: number, 
    blackJackPayout: number, 
    numberOfSplits: number, 
    numberOfDecks: number
): Game {
    let [deck, dealersHand, discard] = dealCards(shuffleImmutable(newDecks(numberOfDecks)), [], [], 2);
    for(const player of players) {
        player.hands.length = 1;
        player.hands[0].bet = minimumBet;
        player.money -= minimumBet;
       [deck, player.hands[0].cards, discard] = dealCards(deck, [], discard, 2);
    }  
    return {
        dealer: {cards: dealersHand},
        players,
        deck,
        discard,
        rules: {
          minimumBet,
          maximumBet,
          blackJackPayout,
          numberOfSplits,
          numberOfDecks
        },
        isRoundOver: false
    };
}

export function hit(game: Game, hand: Hand) {
    [game.deck, hand.cards, game.discard] = dealCard(game.deck, hand.cards, game.discard);
    // If value exceeds 21 then mark it as a stay
    const allValues = Array.from(getValues(hand.cards));
    const valueLessThanOrEqualTo21 = allValues.some(x => x <= 21);
    if(!valueLessThanOrEqualTo21) {
        stay(hand, game);
    }
}

export function haveAllPlayersStayed(game: Game): boolean {
  const f = (b: boolean, h: Hand) => b && h.stayed;
  const g = (b: boolean, p: Player) => b && p.hands.reduce(f, true);
  return game.players.reduce(g, true);
}

export function stay(hand: Hand, game: Game) {
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
                player.money -= game.rules.minimumBet;
                hand.bet = game.rules.minimumBet;
                console.log(`Player: ${player.name} $${player.money}`);
            })
        }
        // round end
        game.isRoundOver = true;
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

export const newRound = (oldGame: Game, setGame: (game: React.SetStateAction<Game>) => void) => {
  console.log('newRound');
  let game = {...oldGame}; 
  [game.dealer.cards, game.discard, game.deck] = dealCards(game.dealer.cards, game.discard, game.deck, game.dealer.cards.length);
  [game.deck, game.dealer.cards, game.discard] = dealCards(game.deck, game.dealer.cards, game.discard, 2);
  for (const player of game.players) {
      for(const hand of player.hands) {
          game.discard = [...game.discard, ...hand.cards];
      }
      player.hands = [{cards: [], bet: game.rules.minimumBet, insurance: false, stayed: false}];
      // deal new cards
     [game.deck, player.hands[0].cards, game.discard] = dealCards(game.deck, player.hands[0].cards, game.discard, 2);
  }
  const playersWithBlackjacks = game.players.filter(p => hasBlackjack(game.dealer.cards, p.hands[0].cards));
  if(playersWithBlackjacks.length > 0) {
    playersWithBlackjacks.forEach(p => {
      p.money += p.hands[0].bet * game.rules.blackJackPayout;
    });
    game.isRoundOver = true;
  } else {
    game.isRoundOver = false;
  }
  setGame(game);
};

export const shouldShowInsurance = (game: Game, hand: Hand) => {
  return !hand.stayed && !game.isRoundOver && game.dealer.cards.length === 2 && game.dealer.cards[1].rank === Rank.Ace 
}

export const shouldShowSplit = (game: Game, hand: Hand) => {
  return !hand.stayed && !game.isRoundOver && hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank;
}

export const splitHand = (game: Game, hand: Hand): Game => {
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
  if(player.hands.length > game.rules.numberOfSplits) {
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

export const split = (oldGame: Game, hand: Hand, setGame: (game: React.SetStateAction<Game>) => void) => {
  let game = splitHand({...oldGame}, hand);
  setGame(game);
}

export const shouldShowDoubleDown = (game: Game, hand: Hand) => !hand.stayed && !game.isRoundOver;

export const shouldShowStay = (game: Game, hand: Hand) => !hand.stayed && !game.isRoundOver;