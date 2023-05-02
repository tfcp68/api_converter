import * as fs from 'fs'
//@ts-ignore
import * as jison from 'jison'



const bnf = fs.readFileSync("./grammar/stateDiagram.jison", "utf8");
export const parser = jison.Parser(bnf);


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
