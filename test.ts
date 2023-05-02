import { make_mermaid_graph } from './state/stateParser'
import {input1, input2, input3, input4, input_sad} from './state/testDiagrams'

let result = make_mermaid_graph(input1)
console.log(result)
result = make_mermaid_graph(input2)
console.log(result)
result = make_mermaid_graph(input3)
console.log(result)
result = make_mermaid_graph(input4)
console.log(result)
