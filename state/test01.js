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

const newDoc = () => {
    return {
      relations: [],
      states: {},
      documents: {},
    };
};
let documents = {
    root: newDoc(),
};

//module.exports = parser;
const setRootDoc = (o) => {
    // rootDoc = { id: 'root', doc: o };
    rootDoc = o;
  };
  
const getRootDoc = () => rootDoc;

const docTranslator = (parent, node, first) => {
    if (node.stmt === STMT_RELATION) {
      docTranslator(parent, node.state1, true);
      docTranslator(parent, node.state2, false);
    } else {
      if (node.stmt === STMT_STATE) {
        if (node.id === '[*]') {
          node.id = first ? parent.id + '_start' : parent.id + '_end';
          node.start = first;
        } else {
          // This is just a plain state, not a start or end
          node.id = node.id.trim();
        }
      }
  
      if (node.doc) {
        const doc = [];
        // Check for concurrency
        let currentDoc = [];
        let i;
        for (i = 0; i < node.doc.length; i++) {
          if (node.doc[i].type === DIVIDER_TYPE) {
            // debugger;
            const newNode = clone(node.doc[i]);
            newNode.doc = clone(currentDoc);
            doc.push(newNode);
            currentDoc = [];
          } else {
            currentDoc.push(node.doc[i]);
          }
        }
  
        // If any divider was encountered
        if (doc.length > 0 && currentDoc.length > 0) {
          const newNode = {
            stmt: STMT_STATE,
            id: generateId(),
            type: 'divider',
            doc: clone(currentDoc),
          };
          doc.push(clone(newNode));
          node.doc = doc;
        }
  
        node.doc.forEach((docNode) => docTranslator(node, docNode, true));
      }
    }
};

const getDirection = () => direction;
const setDirection = (dir) => {
  direction = dir;
};


const trimColon = (str) => (str && str[0] === ':' ? str.substr(1).trim() : str.trim());



//передать функции в yy

parser.yy.setRootDoc = setRootDoc
parser.yy.trimColon = trimColon


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


console.log(parser)
function exec (input) {
    return parser.parse(input);
}


var output = exec(input2)

console.log(output)
