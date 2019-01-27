import fs from "fs";
import {statusReal} from "../../../data";

const file: string = fs.readFileSync(statusReal, "utf-8");

const tokenizeCharacter = (type: string, value: string, input: string, current: number) =>
    (value === input[current] ? [1, {type, value}] : [0, null]);

const tokenizeColon = (input, current) => tokenizeCharacter('colon', ':', input, current);


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

const tokenizeTwoNewlines = (input, current) => tokenizePattern('two-newlines', /[\n\n]/, input, current);

const tokenizeName = (input, current) => tokenizePattern("name", /[a-zA-Z\-]/, input, current);

/*const test = tokenizeName('some-text:',0);
console.log('test',test);*/

const tokenizeString = (input: string, current) => {
    if (input[current] === ' ') {
        let value = '';
        let consumedChars = 0;
        consumedChars++;
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
console.log('result1',result1);

/*

const parseName = (tokens, current) => [current + 1, {
    type: 'NameLiteral',
    value: tokens[current].value,
}];

const parseColon = (tokens, current) => [current + 1, {
    type: 'ColonLiteral',
    value: tokens[current].value,
}];

const parseString = (tokens, current) => [current + 1, {
    type: 'StringLiteral',
    value: tokens[current].value,
}];

const parseNewline = (tokens, current) => [current + 1, {
    type: 'NewlineLiteral',
    value: tokens[current].value,
}];
*/


/*
const parsePackage = (tokens, current) => {
    let token = tokens[++current];
    let node = {
        type: 'Package',
        name: token.value,
        params: [],
    };
    token = tokens[++current];
    while (!(token.type === 'two-newlines' && token.value === '\n')) {
        let param;
        [current, param] = parseToken(tokens, current);
        node.params.push(param);
        token = tokens[current];
    }
    current++;
    return [current, node];
};
*/


/*
const parseToken = (tokens, current) => {
    let token = tokens[current];
    switch (token.type) {
        case:name
    }
    if (token.type === 'name') {
        return parseName(tokens, current);
    }
    if (token.type === 'string') {
        return parseString(tokens, current);
    }
    if (token.type === 'colon') {
        return parseColon(tokens, current);
    }
    if (token.type === 'two-newlines' && token.value === '\n') {
        return parsePackage(tokens, current);
    }

    throw new TypeError(token.type);
};
*/
