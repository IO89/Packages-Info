import fs from 'fs';
import R from 'ramda';
import { statusReal } from '../../../data';

// read file and encode to utf-8
const file:string = fs.readFileSync(statusReal,'utf-8');
//console.log('file',file);

// move element if it starts with space to one index back
const moveOneIndexBack:(accumulator:Array<string>,element:string) => Array<string> = (accumulator, element) => {
    element.match(/^\s/)
        ? accumulator[accumulator.length-1] += element
        : accumulator.push(element);
    return accumulator
};

// Create array separated by line breaks and move values to description
const splitByKeyValuePairs:(file:string)=> Array<string> = R.compose(
    R.reject(n => n== ''),
    R.reduce(moveOneIndexBack,[]),
    R.split('\n')
);

// Extract key value pairs and convert to object
const extractKeyPair:(file:string) => Object = R.compose(
    R.fromPairs(),
    R.of(),
    R.slice(1,3),
    R.split(/(.*):\s(.*)/)
);
//console.log('toKeyValuePairList',extractKeyPair(file));

// Transform one package to Object with key value pairs
const toSeparatePackage:(file:string)=> Array<Object> = R.compose(
    R.mergeAll,
    R.map(extractKeyPair),
    splitByKeyValuePairs
);
//console.log('toPackageTry',toPackageTry(file));

// Transform string to have separate packages by two line breaks
const splitByPackages:(file:string)=> Array<string> = R.split('\n\n');
//console.log('fullPackagesArray',toFullArray(file));

// Iterate trough file and transform all packages
const convertPackages:(file:string) => Array<Object> = R.compose(
    R.map(toSeparatePackage),
    splitByPackages,
);

const Packages = convertPackages(file);
//console.log('Packages',Packages);

const showPackagesNames:(file:Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck('Package')
);
//console.log('showPackagesNames',showPackagesNames(Packages));

export const listAllPackagesSorted:Array<string> = showPackagesNames(convertPackages(file)).sort();
//console.log('listAllPackagesSorted',listAllPackagesSorted);

const showDescriptions:(file:Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck('Description')
);
//console.log('showDescriptions',showDescriptions(Packages));

export const searchByName:(name:string) => Object = (name) => (
    R.find(R.propEq('Package', name)))
    (Packages);
//console.log(searchByName('augeas-lenses'));


