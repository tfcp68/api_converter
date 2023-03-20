function make_message_pretty(message: string): Array<Array<string>> {
    //todo убрать комментарии в мермаиде
    let splited_message: Array<string> = message.split('\n')
    let pretty_message: Array<Array<string>> = [] 

    for(let i = 1; i < splited_message.length; i++) {
        splited_message[i] = splited_message[i].replace(/\s/g, "")
        let flag_start: boolean = splited_message[i].includes('[*]-->')
        let flag_end: boolean = splited_message[i].includes('-->[*]')
        let pair_of_elements: Array<string> = splited_message[i].split('-->')
        
        if(flag_start && flag_end) {
            pair_of_elements[0] = '[*]-->'
            pair_of_elements[1] = '-->[*]'
        }
        else if(flag_start) {
            pair_of_elements[0] = '[*]-->'
        }
        else if(flag_end) {
            pair_of_elements[1] = '-->[*]'
        }

        pretty_message.push(pair_of_elements)
    }

    return pretty_message
}


function get_all_elements(pretty_message: Array<Array<string>>): { [key: string]: number } {
    let dict_elements: { [key: string]: number } = {}
    let value: number = 0
    let vect_elements: Array<string> = [] 

    for(let i = 0; i < pretty_message.length; i++) {
        for(let j = 0; j < 2; j++) {
            let element: string = pretty_message[i][j]

            if(!dict_elements.hasOwnProperty(element)) {
                dict_elements[element] = value
                vect_elements.push(element)
                value++
            }
        }
    }

    //todo return vect_elements
    return dict_elements
}


function mark_graph(pretty_message: Array<Array<string>>, all_elements: { [key: string]: number }): Array<Array<Boolean>> {
    let mermaid_graph: Array<Array<Boolean>> = []

    //resize
    let new_size: number = Object.keys(all_elements).length
    mermaid_graph.length += new_size
    for(let i = 0; i < mermaid_graph.length; i++) {
        mermaid_graph[i] = new Array<Boolean>
        mermaid_graph[i].length += new_size
        mermaid_graph[i].fill(false)
    }

    for(let i = 0; i < pretty_message.length; i++) {
        let pair_of_elements: Array<string> = pretty_message[i]
        let from = all_elements[pair_of_elements[0]]
        let to = all_elements[pair_of_elements[1]]

        mermaid_graph[from][to] = true
    }

    return mermaid_graph
}


function make_mermaid_graph(message: string): Array<Array<Boolean>> {
    let pretty_message: Array<Array<string>> = make_message_pretty(message)
    let all_elements: { [key: string]: number } = get_all_elements(pretty_message)
    let mermaid_graph: Array<Array<Boolean>> = mark_graph(pretty_message, all_elements)

    return mermaid_graph
}


let mermaid_str: string = `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`



make_mermaid_graph(mermaid_str)
