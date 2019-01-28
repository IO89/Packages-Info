import fs from "fs";
import {statusReal} from "../../../data";
import * as util from "util";

const file: string = fs.readFileSync(statusReal, "utf-8");

const tokenizeCharacter = (type: string, value: string, input: string, current: number) =>
    (value === input[current] ? [1, {type, value}] : [0, null]);

const tokenizeColon = (input: string, current: number) => tokenizeCharacter('colon', ':', input, current);

const tokenizePattern = (type: string, pattern: RegExp, input: string, current: number) => {
    let char = input[current];
    let consumedChars = 0;
    if (pattern.test(char)) {
        let value = '';
        while (char && pattern.test(char)) {
            value += char;
            consumedChars++;
            char = input[current + consumedChars];
        }
        return [consumedChars, {type, value}];
    }
    return [0, null]
};

const tokenizeTwoNewlines = (input: string, current: number) => tokenizePattern('two-newlines', /[\n]/, input, current);

const tokenizeName = (input: string, current: number) => tokenizePattern("name", /[a-zA-Z\-]/, input, current);

const test = tokenizeTwoNewlines('\n\n',0);
//console.log('tokenizeTwoNewlines',test);

const tokenizeString = (input: string, current: number) => {
    if (input[current] === ' ') {
        let value = '';
        let consumedChars: number;
        consumedChars=+1;

        let char = input[current + consumedChars];
        while (char !== "\n") {
            if (char === undefined) {
                throw new TypeError("unterminated string ");
            }
            value += char;
            consumedChars++;
            char = input[current + consumedChars];
        }
        return [consumedChars + 1, {type: 'string', value}];
    }
    return [0, null]
};

const tokenizers = [tokenizeName, tokenizeColon, tokenizeString, tokenizeTwoNewlines];

interface Token{
    type:string,
    value:string,
}

interface Tokens {
    current: number|string,
    input:string,
    tokens:[],
    token:Token
}

const tokenizer = (input: string) => {
    let current: any = 0;
    let tokens = [];

    while (current < input.length) {
        let tokenized = false;
        tokenizers.forEach(tokenizer_fn => {
            if (tokenized) {
                return;
            }
            let [consumedChars, token] = tokenizer_fn(input, current);
            if (consumedChars !== 0) {
                tokenized = true;
                current += consumedChars;
            }
            if (token) {
                // @ts-ignore
                tokens.push(token);
            }
        });
        if (!tokenized) {
            throw new TypeError('Unknown character');
        }
    }
    return tokens;
};

const result1 = tokenizer(file);
 //console.log('result1',result1);



const parseFile = (tokens, index): Package[] => {
    console.log('parse file index',index)
    console.log('length',tokens.length);
    let packages: Package[] = [];
    while(index < tokens.length-1) {
        let pairs: Pair[];
        [index, pairs] = parsePackage(tokens, index);
        let pkg = {pairs};
        packages.push(pkg);
    }
    return packages;
}


const parsePackage = (tokens, index): [number, Pair[]] => {
    console.log('parse package index' + index + ' ' + util.inspect(tokens[index]));
    let pairs: Pair[] = [];
    while(tokens[index].type !== 'two-newlines' && tokens[index].value !=='\n\n') {
        let pair: Pair;
        let newIndex: number;
        [newIndex, pair] = parsePair(tokens, index);
        index = newIndex;
        pairs.push(pair);
    }

    return [index+1, pairs];
};

const parsePair = (tokens, index): [number, Pair] => {
    console.log('parse pair index' + index + ' ' + util.inspect(tokens[index]));

    if (tokens[index].type !== 'name' || tokens[index + 1].type !== 'colon') {
        throw `all is bad ${tokens[index]},${index}`;
    }
    let name = tokens[index].value;

    index += 2;
    let value = '';
    while (tokens[index].type === 'string') {
        value += tokens[index].value;
        index += 1;
    }

    return [index, {key: name, value}];
};

interface Pair {
    key: string;
    value: string;
}

interface Package {
    pairs: Pair[];
}
// console.log('new lenght',result1.length);
console.log(JSON.stringify(parseFile(result1, 0), null, 2));
