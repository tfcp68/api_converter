export const input1 = `stateDiagram-v2
[*] --> Still
Still --> [*]
Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]`

export const input2 = `stateDiagram-v2
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

export const input3 = `stateDiagram-v2
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
note right of hasMoney
predicates/hasCoins TEST WARNING
end note
note right of hasMoney
TEST predicates/hasCoins TEST WARNING
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

export const input4 = `stateDiagram-v2
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


export const input_sad = `stateDiagram-v2
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
