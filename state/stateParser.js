// myparser.js
import fs from "fs";
import jison from "jison";

var bnf = fs.readFileSync("./stateDiagram.jison", "utf8");
var parser = new jison.Parser(bnf);


/////////////////////////////////
// куски stateDB

const DEFAULT_DIAGRAM_DIRECTION = 'LR';
const DEFAULT_NESTED_DOC_DIR = 'TB';
const STMT_STATE = 'state';
const STMT_RELATION = 'relation';
const STMT_CLASSDEF = 'classDef';
const STMT_APPLYCLASS = 'applyClass';

const DEFAULT_STATE_TYPE = 'default';
const DIVIDER_TYPE = 'divider';

const START_NODE = '[*]';
const START_TYPE = 'start';
const END_NODE = START_NODE;
const END_TYPE = 'end';

const COLOR_KEYWORD = 'color';
const FILL_KEYWORD = 'fill';
const BG_FILL = 'bgFill';
const STYLECLASS_SEP = ',';



function newClassesList() {
    return {};
}

let direction = DEFAULT_DIAGRAM_DIRECTION;
let rootDoc = [];
let classes = newClassesList();
let dividerCnt = 0;

const setRootDoc = (o) => {
    rootDoc = o;
  };
  
const getRootDoc = () => rootDoc;

const getDirection = () => direction;
const setDirection = (dir) => {
  direction = dir;
};

const getDividerId = () => {
  dividerCnt++;
  return 'divider-id-' + dividerCnt;
};

const trimColon = (str) => (str && str[0] === ':' ? str.substr(1).trim() : str.trim());



//передать функции в yy

parser.yy.setRootDoc = setRootDoc
parser.yy.getRootDoc = getRootDoc
parser.yy.trimColon = trimColon

parser.yy.setDirection = setDirection
parser.yy.getDirection = getDirection
parser.yy.getDividerId = getDividerId

//////////////////////////////////////

var input1 = `stateDiagram-v2
[*] --> Still
Still --> [*]
Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]`

var input2 = `stateDiagram-v2
[*]-->INIT: RESET
INIT-->INTRO: RUN
INTRO-->MAIN_MENU: TO_MENU
MAIN_MENU-->[*]: EXIT
MAIN_MENU-->MAIN_MENU: MENU_HOVER (index)
MAIN_MENU-->GAME_LOBBY: CREATE_GAME (playerId)
MAIN_MENU-->GAME_LOBBY: JOIN_GAME (gameId, playerId)
GAME_LOBBY-->[*]: EXIT
GAME_LOBBY-->MAIN_MENU: TO_MENU
GAME_LOBBY-->GAME_STARTING: START_GAME (gameId, playerIds)
GAME_STARTING-->IN_GAME: BEGIN_GAME (gameId, game)
IN_GAME-->[*]: EXIT
IN_GAME-->SCORE_SCREEN: END_GAME
IN_GAME-->MAIN_MENU: TO_MENU
SCORE_SCREEN-->MAIN_MENU: TO_MENU
SCORE_SCREEN-->[*]: EXIT`

var input3 = `stateDiagram-v2
direction LR
[*]-->IDLE: RESET
IDLE-->FINISHED: SKIP
note left of IDLE
listen/startTrade => START_TRADE
listen/cropHarvested => ENTER_TARGET_MODE
listen/cropFertilized => ENTER_TARGET_MODE
listen/cropPlanted => ENTER_TARGET_MODE
listen/forceEndPhase => SKIP
emit/revokeTradeOffers
emit/disableTargetMode
end note
state hasMoney <<choice>>
note left of hasMoney
predicates/hasCoins
end note
IDLE-->hasMoney: START_TRADE
hasMoney-->IDLE: no
hasMoney-->HAS_TRADE: yes
HAS_TRADE-->FINISHED: SKIP
HAS_TRADE-->HAS_TRADE: CHANGE_TRADE_OFFER
HAS_TRADE-->OFFER_SENT: MAKE_OFFER
note left of OFFER_SENT
emit/makeTradeOffer
listen/completeTrade => predicates/isOwnOffer
predicates/isOwnOffer => OFFER_ACCEPTED | CANCEL_SELECTION
end note
OFFER_SENT-->IDLE: CANCEL_SELECTION
OFFER_SENT-->IDLE: OFFER_ACCEPTED
OFFER_SENT-->FINISHED: SKIP
state isAffected <<choice>>
note right of isAffected
predicates/hasEligibleEffectConditions
end note
IDLE-->isAffected: ENTER_TARGET_MODE
isAffected-->IDLE: no
isAffected-->TARGETING: yes
note left of TARGETING
emit/enableTargetMode
end note
TARGETING-->IDLE: CANCEL_SELECTION
TARGETING-->FINISHED: SKIP
TARGETING-->EFFECT_APPLIED: APPLY_EFFECT
note right of EFFECT_APPLIED
emit/applyEffect
emit/disableTargetMode
listen/applyEffect => APPLY_EFFECT
end note
EFFECT_APPLIED-->IDLE: APPLY_EFFECT
FINISHED --> [*]`

var input4 = `stateDiagram-v2
[*]-->IDLE: RESET
note left of IDLE
emit/startTradeCollection
listen/startTradeCollection => START_COLLECT
end note
state hasCardsInHand <<choice>>
note right of hasCardsInHand
predicates/hasCardsInHand
end note
IDLE-->hasCardsInHand: START_COLLECT
hasCardsInHand-->COLLECT: yes
note left of COLLECT
emit/enableTargetMode [CARD_OWN]
end note
COLLECT-->COLLECT: HOVER (index)
COLLECT-->COLLECT: ADD_CARD_TO_TRADE (index)
COLLECT-->COLLECT: REMOVE_CARD_FROM_TRADE (index)
hasCardsInHand-->FINISHED: no
COLLECT-->FINISHED: SKIP
COLLECT-->OFFERS_WAITING: SEND_TRADE (TCard[])
note left of OFFERS_WAITING
emit/startTrade
emit/disableTargetMode
listen/tradeOffersGathered => GATHER_OFFERS
listen/forceEndPhase => SKIP
end note
state hasOffers <<choice>>
note left of hasOffers
predicates/hasTradeOffers
end note
OFFERS_WAITING--> hasOffers: GATHER_OFFERS (offers)
hasOffers-->OFFERS_CHOOSING: yes
hasOffers-->FINISHED: no
note left of OFFERS_CHOOSING
listen/forceEndPhase => SKIP
end note
OFFERS_CHOOSING-->FINISHED: SKIP
OFFERS_CHOOSING-->OFFER_ACCEPTED: ACCEPT_OFFER (player)
note left of OFFER_ACCEPTED
emit/completeTrade
listen/completeTrade => ACCEPT_OFFER
end note
OFFER_ACCEPTED-->FINISHED: ACCEPT_OFFER
FINISHED --> [*]`


var input_sad = `stateDiagram-v2
[*] --> First
First --> Second
First --> Third

state First {
    [*] --> fir
    fir --> [*]
}
state Second {
    [*] --> sec
    sec --> [*]
}
state Third {
    [*] --> thi
    thi --> [*]
}`


function exec (input) {
    return parser.parse(input);
}

function take_directions(output) {
  var directions = []

  for(var i = 0; i < output.length; i++) {
    if(output[i].stmt == 'relation') {
      var direction_i = []
      var st1 = output[i].state1.id
      var st2 = output[i].state2.id
      
      if(st1 == '[*]' && st2 == '[*]') {
        direction_i.push('~~~START~~~')
        direction_i.push('~~~END~~~')
      }
      if (st1 == '[*]') {
        direction_i.push('~~~START~~~')
        direction_i.push(st2)
      }
      else if(st2 == '[*]') {
        direction_i.push(st1)
        direction_i.push('~~~END~~~')
      }
      else {
        direction_i.push(st1)
        direction_i.push(st2)
      }

      directions.push(direction_i)
    }
  }
  return directions
}


function get_all_elements(directions) {
  let dict_elements = {}
  let value = 0
  let vect_elements= [] 

  for(let i = 0; i < directions.length; i++) {
      for(let j = 0; j < 2; j++) {
          let element = directions[i][j]
          if(!dict_elements.hasOwnProperty(element)) {
              dict_elements[element] = value
              vect_elements.push(element)
              value++
          }
      }
  }

  return dict_elements
}


function mark_graph(directions, all_elements) {
  const new_size = Object.keys(all_elements).length
  const mermaid_graph =  new Array(new_size)

  for(let i = 0; i < mermaid_graph.length; i++) {
      mermaid_graph[i] = new Array(new_size).fill(false)
  }

  for(let i = 0; i < directions.length; i++) {
      const pair_of_elements = directions[i]
      const from = all_elements[pair_of_elements[0]]
      const to = all_elements[pair_of_elements[1]]

      mermaid_graph[from][to] = true
  }

  return mermaid_graph
}


function make_mermaid_graph(message) {
  const output = exec(message)
  const directions = take_directions(output)
  const all_elements = get_all_elements(directions)
  const mermaid_graph = mark_graph(directions, all_elements)

  console.log(output)
  console.log(directions)
  console.log(all_elements)
  console.log(mermaid_graph)
  return mermaid_graph
}

var result = make_mermaid_graph(input4)

//console.log(result)