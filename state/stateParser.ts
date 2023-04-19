import * as fs from 'fs'
//@ts-ignore
import * as jison from 'jison'


const bnf = fs.readFileSync("./grammar/stateDiagram.jison", "utf8");
const parser = jison.Parser(bnf);


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
let rootDoc: any = [];
const classes = newClassesList();
let dividerCnt = 0;

const setRootDoc = (o: any) => {
    rootDoc = o;
  };

const getRootDoc = () => rootDoc;

const getDirection = () => direction;
const setDirection = (dir: any) => {
  direction = dir;
};

const getDividerId = () => {
  dividerCnt++;
  return 'divider-id-' + dividerCnt;
};

const trimColon = (str: string) => (str && str[0] === ':' ? str.substr(1).trim() : str.trim());

parser.yy.setRootDoc = setRootDoc
parser.yy.getRootDoc = getRootDoc
parser.yy.trimColon = trimColon

parser.yy.setDirection = setDirection
parser.yy.getDirection = getDirection
parser.yy.getDividerId = getDividerId


const input1 = `stateDiagram-v2
[*] --> Still
Still --> [*]
Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]`

const input2 = `stateDiagram-v2
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

const input3 = `stateDiagram-v2
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

const input4 = `stateDiagram-v2
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


const input_sad = `stateDiagram-v2
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


type DirectionsArray = string[][]
//type DictElements = { [key: string]: string | DictElements | string[] | null }

function exec (input: string) {
    /**
     * @brief Функция, которая парсит диаграмму
     * @param input: строка, state диаграмма мермаид
     * @returns Возвращает словарь, который спарсили
     */
    return parser.parse(input);
}


function take_directions(parsed_diargam: any): DirectionsArray {
    /**
     * @brief Функция, которая собирает направления из диаграммы
     * @param parsed_diargam: словарь, который был получен из парсера
     * @returns Возвращает направления из диаграммы и комментарий к ней
     */
    const directions: DirectionsArray = []

    for(let i = 0; i < parsed_diargam.length; i++) {
        if(parsed_diargam[i].stmt === 'relation') {
        const direction_i: string[] = []
        const st1 = parsed_diargam[i].state1.id
        const st2 = parsed_diargam[i].state2.id

        if(st1 === '[*]' && st2 === '[*]') {
            direction_i.push('~~~START~~~')
            direction_i.push('~~~END~~~')
        }
        if (st1 === '[*]') {
            direction_i.push('~~~START~~~')
            direction_i.push(st2)
        }
        else if(st2 === '[*]') {
            direction_i.push(st1)
            direction_i.push('~~~END~~~')
        }
        else {
            direction_i.push(st1)
            direction_i.push(st2)
        }

        const keys = Object.keys(parsed_diargam[i])
        if(keys.includes('description')) {
            const descr = parsed_diargam[i].description
            direction_i.push(descr)
        }
        else {
            direction_i.push('')
        }

        directions.push(direction_i)
        }
    }

    return directions
}


function get_all_elements(directions: DirectionsArray): string[] {
    /**
     * @brief Функция, которая собирает элементы, которые есть в мермаид диаграмме
     * @param directions: массив направлений
     * @returns Возвращает элементы диаграммы в виде массива
     */
    const dict_elements: string[] = []

    for(let i = 0; i < directions.length; i++) {
        for(let j = 0; j < 2; j++) {
            const element = directions[i][j]
            if(!dict_elements.includes(element)) {
                dict_elements.push(element)
            }
        }
    }

    return dict_elements
}


function setup_actions(directions: DirectionsArray, all_elements: string[]) {
    /**
     * @brief Функция, которая делает словарь связей actions
     * @param directions: массив направлений
     * @param all_elements: элементы, которые есь в мермаид диаграмме
     * @returns Возвращает словарь actions
     */
    const actions: any = {}

    for (let i = 0; i < all_elements.length; i++) {
        const element_i = all_elements[i]
        actions[element_i] = {}
        for(let j = 0; j < all_elements.length; j++) {
            const element_j = all_elements[j]
            actions[element_i][element_j] = null
        }
    }

    for(let i = 0; i < directions.length; i++) {
        const pair_of_elements = directions[i]
        const from = pair_of_elements[0]
        const to = pair_of_elements[1]
        const description = pair_of_elements[2]

        if(actions[from][to] === null) {
            actions[from][to] = [description]

        }
        else {
            actions[from][to].push(description)
        }
    }

    return actions
}


function setup_notes(parsed_diargam: any, all_elements: string[]) {
    /**
     * @brief Функция, которая достаёт записки из мермаид диаграммы
     * @param parsed_diargam: словарь, который был получен из парсера
     * @param all_elements: элементы, которые есь в мермаид диаграмме
     * @returns Возвращает словарь записок из мермаид диаграммы
     */
    const notes: any = {}

    for(let i = 0; i < all_elements.length; i++) {
        const element_i = all_elements[i]
        notes[element_i] = null
    }

    for(let i = 0; i < parsed_diargam.length; i++) {
        if(parsed_diargam[i].stmt === 'state') {
            const keys = Object.keys(parsed_diargam[i])

            if(keys.includes('note')) {
                const note_keys = Object.keys(parsed_diargam[i].note)

                if(note_keys.includes('text')) {
                    const from: string = parsed_diargam[i].id
                    const note_text: string = parsed_diargam[i].note.text

                    if(notes[from] === null) {
                        notes[from] = [note_text]
                    }
                    else {
                        notes[from].push(note_text)
                    }
                }
            }
        }
    }

    return notes
}


function find_sus_directions(directions: DirectionsArray) {
    /**
     * @brief Функция, собирает подозрительные переходы без комментариев
     * @param directions: массив направлений
     * @returns Возвращает массив с подозрительными переходами
     */
    const sus_directions = []

    for(let i = 0; i < directions.length; i++) {
        if(directions[i][2] === '') {
            sus_directions.push(directions[i])
        }
    }
    return sus_directions
}

function mark_graph(parsed_diargam: any, directions: DirectionsArray, all_elements: string[]) {
    /**
     * @brief Функция, которая по направлениям и элементам строит словарь связей
     * @param parsed_diargam: словарь, который был получен из парсера
     * @param directions: массив направлений
     * @param all_elements: элементы, которые есь в мермаид диаграмме
     * @returns Возвращает словарь связей
     */
    const mermaid_graph: any = {}
    mermaid_graph['states'] = all_elements
    mermaid_graph['actions'] = setup_actions(directions, all_elements)
    mermaid_graph['notes'] = setup_notes(parsed_diargam, all_elements)
    mermaid_graph['sus_directions'] = find_sus_directions(directions)

    return mermaid_graph
}


function find_choices(parsed_diargam: any): string[] {
    /**
     * @brief Функция, которая ищет "элементы развилки"
     * @param parsed_diargam: словарь, который был получен из парсера
     * @returns Возвращает массив с "элементами развилки"
     */
    const choices: string[] = []

    for(let i = 0; i < parsed_diargam.length; i++) {
        if(parsed_diargam[i].stmt === 'state') {
            const keys = Object.keys(parsed_diargam[i])
            if(keys.includes('type')) {
                const state_type = parsed_diargam[i].type

                if(state_type === 'choice') {
                    const choice_element = parsed_diargam[i].id
                    choices.push(choice_element)
                }
            }
        }
    }

    return choices
}


function mark_choices(parsed_diargam: any, directions: DirectionsArray, mermaid_graph: any) {
    /**
     * @brief Функция, которая дополняет связи actions пунктами из "элементов развилок"
     * @param parsed_diargam: словарь, который был получен из парсера
     * @param directions: массив направлений
     * @param mermaid_graph: словарь связей, который будет дополнен
     * @returns Возвращает обновлённый словарь связей
     */
    const choices = find_choices(parsed_diargam)

    for(let k = 0; k < choices.length; k++) {
        const choice: string = choices[k]

        const branch = mermaid_graph['actions'][choice]
        for(let i = 0; i < directions.length; i++) {
            const to_choice = directions[i][1]

            if(to_choice === choice) {
                const from = directions[i][0]
                const choice_description = directions[i][2]

                //в mermaid_graph должен в from добавить пункты из to
                for(const to in mermaid_graph['actions'][from]) {
                    if(branch[to] !== null) {
                        if(mermaid_graph['actions'][from][to] === null) {
                            //mermaid_graph['actions'][from][to] = branch[to]
                            mermaid_graph['actions'][from][to] = [choice_description]
                        }
                        else {
                            //mermaid_graph['actions'][from][to] = mermaid_graph['actions'][from][to].concat(branch[to])
                            mermaid_graph['actions'][from][to].push(choice_description)
                        }
                    }
                }
            }
        }
    }

    return mermaid_graph
}


export function make_mermaid_graph(message: string) {
    /**
     * @brief Построение словаря связей
     * @param message: строка, state диаграмма мермаид
     * @returns Возвращает словарь связей
     */
    const parsed_diargam = exec(message)
    const directions = take_directions(parsed_diargam)
    const all_elements = get_all_elements(directions)
    let mermaid_graph = mark_graph(parsed_diargam, directions, all_elements)
    mermaid_graph = mark_choices(parsed_diargam, directions, mermaid_graph)
    return mermaid_graph
}

const result = make_mermaid_graph(input1)
console.log(result)