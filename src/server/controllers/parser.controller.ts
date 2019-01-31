import fs from "fs";
import {statusReal} from "../../../data";
import R from "ramda";
import {element} from "prop-types";

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

const tokenizeString = (input: string, current: number) => {
    if (input[current] === ' ') {
        let value = '';
        let consumedChars: number;
        consumedChars = +1;

        let char = input[current + consumedChars];
        while (char !== "\n") {
            if (char === undefined) {
                throw new TypeError("Unterminated string ");
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

interface Token {
    type: string,
    value: string,
}

const tokenizer = (input: string) => {
    let current: any = 0;
    let tokens: Token[] = [];

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

// console.log(result1);


interface Pair {
    key: string;
    value: string;
}

interface Package {
    pairs: Pair[];
}

const parseFile = (tokens, index): Package[] => {
    let packages: Package[] = [];
    while (index < tokens.length - 1) {
        let pairs: Pair[];
        [index, pairs] = parsePackage(tokens, index);
        let pkg = {pairs};
        packages.push(pkg);
    }
    return packages;
};


const parsePackage = (tokens, index): [number, Pair[]] => {
    let pairs: Pair[] = [];
    while (tokens[index].type !== 'two-newlines') {
        let pair: Pair;
        let newIndex: number;
        [newIndex, pair] = parsePair(tokens, index);
        index = newIndex;
        pairs.push(pair);
    }
    return [index + 1, pairs];
};
console.log('parsePackage',parsePackage(result1,0));

const parsePair = (tokens, index): [number, Pair] => {
    let name = tokens[index].value;
    index += 2;
    let value = '';
    while (tokens[index].type === 'string') {
        value += tokens[index].value;
        index += 1;
    }
    return [index, {key: name, value}];
};
const parsedFile = parseFile(result1, 0);
// console.log('parsepair',parsePair(result1,0));
// console.log('parsedFile',JSON.stringify(parsedFile,null,2));
// console.log(parsedFile);
export const toSeparatePackages = parsedFile.map(element => element.pairs);

const toPackagesNames = toSeparatePackages.map(element => element.filter(element => element.key === 'Package'));

export const sortedNames =  toPackagesNames.map(element => element.map(element =>element.value)).sort();
//console.log(sortedNames);

const toDescriptions = toSeparatePackages.map(element =>element.filter(element=>element.key === 'Description'));

// console.log(toDescriptions.map(element =>element.map(element=>element.value)));

//console.log(toPackagesNames);
// console.log(packagesNames);
// console.log(JSON.stringify(parseFile(result1, 0), null, 2));