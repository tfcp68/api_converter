// @ts-ignore
const jison=require('jison')
import * as fs from 'fs';
// @ts-ignore
//import mermaid from 'mermaid';
const grammar=fs.readFileSync('./mermaid/stateGrammar.jison').toString('utf8');


export const transformJison = (src: string): string => {
// @ts-ignore No typings for jison
  const parser = new jison.Generator(src, {
    moduleType: 'js',
    'token-stack': true,
  });
  const source = parser.generate({ moduleMain: '() => {}' });
  const exporter = `
	parser.parser = parser;
	export { parser };
	export default parser;
	`;
  return `${source} ${exporter}`;
};

const stateDiagramParser=new jison.Parser(grammar);


const input = `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`;


// console.log(stateDiagramParser);

const result = stateDiagramParser.parse(input);
console.log(result);

//console.log(mermaid);
