import fs from "fs";
import {statusReal} from "../../../data";

// read file and encode to utf-8
const file: string = fs.readFileSync(statusReal, "utf-8");

const tokenizeCharacter = (type: string, value: string, input: string, current) =>
    (value === input[current] ? [1, {type, value}] : [0, null]);

const tokenizeParenOpen = (input, current) => tokenizeCharacter('paren', '(', input, current);

const tokenizeParenClose = (input, current) => tokenizeCharacter('paren', ')', input, current);

const tokenizeColon = (input, current) => tokenizeCharacter('colon', ':', input, current);

const tokenizeNewline = (input, current) => tokenizeCharacter('newLine', '\n', input, current);

const tokenizePipe = (input, current) => tokenizeCharacter('pipe', '|', input, current);

const tokenizeDash = (input, current) => tokenizeCharacter('dash', '-', input, current);

const tokenizeGreaterthan = (input, current) => tokenizeCharacter('greaterthan', '>', input, current);

const tokenizeLessthan = (input, current) => tokenizeCharacter('lessthan', '<', input, current);

const tokenizeDot = (input, current) => tokenizeCharacter('dot', '.', input, current);

const tokenizeComma = (input, current) => tokenizeCharacter('comma', ',', input, current);

const tokenizePattern = (type: string, pattern, input, current) => {
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

const tokenizeNumber = (input, current) => tokenizePattern("number", /[0-9]/, input, current);

const tokenizeTwoNewlines = (input, current) => tokenizePattern('two-newlines', /[\n\n]/, input, current);

const tokenizeName = (input, current) => tokenizePattern("name", /[a-z]/i, input, current);

const tokenizeSpecialChars = (input,current) => tokenizePattern('special-chars',/\(.*\)/,input,current);

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

const skipWhiteSpace = (input, current) =>   (/\s/.test(input[current])) ? [1, null] : [0, null];

const tokenizers = [tokenizeName, tokenizeColon,tokenizeString, tokenizeTwoNewlines,tokenizeDash];


const tokenizer = (input:string) => {
    let current = 0;
    let tokens = [];
    while (current < input.length) {
        let tokenized = false;
        tokenizers.forEach(tokenizer_fn => {
            if (tokenized) {return;}
            let [consumedChars, token] = tokenizer_fn(input, current);
            if(consumedChars !== 0) {
                tokenized = true;
                // @ts-ignore
                current += consumedChars;
            }
            if(token) {
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

const res = tokenizer(file);
console.log('res',res);

const parseNumber = (tokens, current) => [current + 1,
    {type: 'NumberLiteral',
        value: tokens[current].value,
    }];

const parseString = (tokens, current) => [current + 1,
    {type: 'StringLiteral',
        value: tokens[current].value,
    }];
