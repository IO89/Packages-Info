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

// Transform string to have separate packages by two line breaks
const splitByPackages:(file:string)=> Array<string> = R.split('\n\n');

//console.log('fullPackagesArray',toFullArray(file));

// Create array separated by line breaks and move values to description
const splitByKeyValuePairs:(file:string)=> Array<string> = R.compose(
    R.reject(n => n== ''),
    R.reduce(moveOneIndexBack,[]),
    R.split('\n')
);

//const packageArray:Array<string> = toFullArray(file);

/*const formatArray = R.compose(
    R.chain(R.split('\n')),
    R.slice(0,1)
);*/
// Extract key value pairs and convert to object
const extractKeyPair:(file:string) => Object = R.compose(
    R.fromPairs(),
    R.of(),
    R.slice(1,3),
    R.match(/(.*):\s(.*)/)
);
//console.log('toKeyValuePairList',toKeyValuePairList(file));

// Transform one package to Object with key value pairs
const toSeparatePackage:(file:string)=> Array<Object> = R.compose(
    R.mergeAll,
    R.map(extractKeyPair),
    splitByKeyValuePairs
);
//console.log('toPackageTry',toPackageTry(file));

// Iterate trough file and transform all packages
const convertPackages:(file:string) => Array<Object> = R.compose(
    R.map(toSeparatePackage),
    splitByPackages,
);
console.log('toPackagesTryOut',convertPackages(file));

//console.log('formatArray',formatArray(packageArray))
//const formattedArray =formatArray(packageArray);

//console.log('packageArray',packageArray)
/*const splitAgain = packageArray.map(element => {
    let array = [];
    const split = R.chain(R.split('\n'))(packageArray);
    return [...array,split]
});*/

//console.log('splitAgain',splitAgain)

// Separate elements by colon and create key value pairs
const toKeyValuePairs = /*formattedArray.map((element,index)=>{
    let toObjects = {};
    const split = formattedArray[index].split(':');
    toObjects[split[0]]=split[1];
    return toObjects*/
R.compose(
    R.fromPairs,
    R.of(),
    R.chain(R.split(':'))
);

//console.log('toKeyValuePairs',toKeyValuePairs(formattedArray));

/*const parsePackages = R.compose(
    R.map(toKeyValuePairs),
    toFullArray
);*/
//console.log('parsePackages',parsePackages(file));

// Transform array to have only one package with separate pairs
const packageKeyPair:(file:Array<string>) => Object = R.compose(
    R.fromPairs(),
    R.of(),
    //R.reduce(splitByNewline,[]),
    R.slice(0,1),

);
//console.log('packageKeyPair',packageKeyPair(packageArray));

/*const toPackage = R.compose(
    //R.mergeAll,
    R.map(packageKeyPair),
    toFullArray);*/
//console.log('toPackage',toPackage(file));


const showPackagesNames:(file:Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck('Package')
);
//console.log('showPackagesNames',showPackagesNames(toKeyValuePairs));
const packagesNames = showPackagesNames(toKeyValuePairs);

export const listAllPackagesSorted:Array<string> = showPackagesNames(toKeyValuePairs).sort();
//console.log('listAllPackagesSorted',listAllPackagesSorted);

const showDescriptions:(file:Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck('Description')
);
//console.log('showDescriptions',showDescriptions(toKeyValuePairs));
const descriptions = showDescriptions(toKeyValuePairs);

const packagesAndDescriptions:(packagesNames:Object,descriptions:Object)=>Object =  R.zipObj(packagesNames,descriptions);
//console.log('packagesDescriptions',packagesAndDescriptions);

const searchByName:(name:string)=> any = (name) => R.pluck(name);
//console.log(searchByName('libkrb5-3')(packagesAndDescriptions));


