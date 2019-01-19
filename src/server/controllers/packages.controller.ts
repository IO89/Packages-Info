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

// Build dependencies into array and clean special characters in brackets
const removeSpecialCharacters = R.compose(R.trim, R.replace(/(\(.*\))/, ''));
const toDependenciesArray = R.compose(
    R.map(removeSpecialCharacters),
    R.split(','),
);

// Partial apply lens  where Depends field exists
const dependsCheck = R.ifElse(
    R.compose(R.isNil, R.path(['Depends'])),
    R.identity,
    R.over(R.lensPath(['Depends']), toDependenciesArray)
);

// Packages with depends as an array
const withDependencies: (file: string) => Array<Object> = R.compose(
    dependsCheck,
    toSeparatePackage
);
//console.log('withDependenciesarray',withDependencies(file));

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
