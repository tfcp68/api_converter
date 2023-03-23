type DictElements = { [key: string]: number }
type PrettyMessage = string[][]
type BoolMatrix = boolean[][]


function make_message_pretty(message: string): PrettyMessage {
    const pretty_message = message
    .split('\n')
    .slice(1)
    .map(item => item
        .replace('[*]-->', '##START##-->')
        .replace('[*] -->', '##START##-->')
        .replace('-->[*]', '-->##END##')
        .replace('--> [*]', '-->##END##')
    )
    .map((e => e.split('-->').map(t => t.trim())))

    return pretty_message
}


function get_all_elements(pretty_message: PrettyMessage): DictElements {
    const dict_elements = pretty_message
    .flatMap((s) => s)
    .reduce((acc, s) => (acc.includes(s) ? acc : acc.concat(s)), [] as string[])
    .reduce(
        (acc, s, ix) =>
            Object.assign(acc, {
                [s]: ix,
            }),
        {}
    )
    return dict_elements
}


function mark_graph(pretty_message: PrettyMessage, all_elements: DictElements): BoolMatrix {
    const new_size: number = Object.keys(all_elements).length
    const mermaid_graph = Array<Array<boolean>>(new_size)

    for(let i = 0; i < mermaid_graph.length; i++) {
        mermaid_graph[i] = Array<boolean>(new_size).fill(false)
    }

    for(let i = 0; i < pretty_message.length; i++) {
        const pair_of_elements: string[] = pretty_message[i]
        const from = all_elements[pair_of_elements[0]]
        const to = all_elements[pair_of_elements[1]]

        mermaid_graph[from][to] = true
    }

    return mermaid_graph
}


function make_mermaid_graph(message: string) {
    const pretty_message: PrettyMessage = make_message_pretty(message)
    const all_elements: DictElements = get_all_elements(pretty_message)
    const mermaid_graph: BoolMatrix = mark_graph(pretty_message, all_elements)

    return mermaid_graph
}


const mermaid_str: string = `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`



make_mermaid_graph(mermaid_str)
