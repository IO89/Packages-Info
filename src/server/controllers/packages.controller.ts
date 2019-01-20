import fs from 'fs';
import R from 'ramda';
import {statusReal} from '../../../data';

// read file and encode to utf-8
const file: string = fs.readFileSync(statusReal, 'utf-8');

// move element if it starts with space to one index back
const moveOneIndexBack: (accumulator: Array<string>, element: string) => Array<string> = (accumulator, element) => {
    element.match(/^\s/)
        ? accumulator[accumulator.length - 1] += element
        : accumulator.push(element);
    return accumulator
};

// Create array separated by line breaks and move values to description
const splitByKeyValuePairs: (file: string) => Array<string> = R.compose(
    R.reject(n => n == ''),
    R.reduce(moveOneIndexBack, []),
    R.split('\n')
);
//console.log('splitByKeyValuePairs',splitByKeyValuePairs(file));

// Extract key value pairs and convert to object
const extractKeyPair: (file: string) => Object = R.compose(
    R.fromPairs(),
    R.of(),
    R.slice(1, 3),
    R.split(/(.*):\s(.*)/)
);
//console.log('toKeyValuePairList',extractKeyPair(file));

// Transform one full package to an Object with key value pairs
const toSeparatePackage: (file: string) => Array<Object> = R.compose(
    R.mergeAll,
    R.map(extractKeyPair),
    splitByKeyValuePairs
);
//console.log('toSeparatePackage',toSeparatePackage(file));

// Build dependencies into array and remove special characters in brackets
const removeSpecialCharacters = R.compose(
    R.trim,
    R.replace(/\(.*\)/, '')
);

const toDependenciesArray = R.compose(
    R.map(removeSpecialCharacters),
    R.chain(R.split('|')),
    R.split(','),
);

// Check if Depends field if empty
const emptyDepends = R.compose(
    R.isNil,
    R.path(['Depends'])
);

// Partial apply lens  where Depends field exists
const dependsCheck:(file:string) => Array<Object> = R.ifElse(
    emptyDepends,
    R.identity,
    R.over(R.lensPath(['Depends']), toDependenciesArray)
);

// Packages with depends as an array
const withDependencies: (file: string) => Array<Object> = R.compose(
    dependsCheck,
    toSeparatePackage
);
//console.log('withDependenciesArray',withDependencies(file));

// find reverse dependencies and
const extractName = R.compose(R.prop('Package'),withDependencies);
console.log('extractName',extractName(file));

// Find where packages where Package name is in Depends field
const searchNameDepends = R.filter(
    R.where({
        Depends: R.includes(extractName)
    })
);
//console.log('searchNameDepends',searchNameDepends(Packages));

// Check if Depends exist and find rev dependencies
const searchReverseDependencies = R.compose(
    searchNameDepends,
    R.reject(emptyDepends)
);
//console.log('searchReverseDependencies',searchReverseDependencies(Packages));

// build reverse dependencies array
const reverseDependenciesArray = R.compose(
    R.map(R.prop('Package')),
    searchReverseDependencies
);
//console.log('reverseDependenciesArray',reverseDependenciesArray(Packages));

// Merge reverse dependencies into object with depends
//const mergedDependencies = R.merge(withDependencies(file),{'Reverse': reverseDependenciesArray(Packages)});
//console.log('mergedDependencies',mergedDependencies);




// Separate by newline breaks and Iterate trough file and transform all packages
const convertAllPackages: (file: string) => Array<Object> = R.compose(
    R.map(withDependencies),
    R.split('\n\n')
);
//console.log('convertAllPackages',convertAllPackages(file));

const Packages = convertAllPackages(file);
//console.log('Packages',Packages);

const showPackagesNames: (file: Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck('Package')
);
//console.log('showPackagesNames',showPackagesNames(Packages));

export const listAllPackagesSorted: Array<string> = showPackagesNames(Packages).sort();
//console.log('listAllPackagesSorted',listAllPackagesSorted);

export const searchByName: (name: string) => Object = (name) => (
    R.find(R.propEq('Package', name)))(Packages);
//console.log('searchByName', searchByName('python-pkg-resources'));
