import * as fs from 'fs'
//@ts-ignore
import * as jison from 'jison'



const bnf = fs.readFileSync("grammar/sequenceDiagram.jison", "utf8");
export const parser = jison.Parser(bnf);

console.log(parser)



const input1 = `sequenceDiagram
participant A as Alice
participant J as John
A->>J: Hello John, how are you?
J->>A: Great!
`

