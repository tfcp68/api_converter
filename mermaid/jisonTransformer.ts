// @ts-ignore No typings for jison
const jison=require('jison')


import value from './stateGrammar.jison'

const jison_grammar_state: string = value


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



const input = `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`


const output = transformJison(jison_grammar_state)