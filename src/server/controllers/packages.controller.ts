import fs from 'fs';
import R from 'ramda';
import { statusReal } from '../../../data';

// read file and encode to utf-8
const file:string = fs.readFileSync(statusReal,'utf-8');
//console.log('file',file);

// move element if it starts with space to one index back
const removeSpaces:(accumulator:Array<string>,element:string) => Array<string> = (accumulator, element) => {
    element.match(/^\s+/g)
        ? accumulator[accumulator.length-1] += element
        : accumulator.push(element);
    return accumulator
};
// Transform array to contain fields with description
const toFullArray:(file:string)=> Array<string> = R.compose(
    R.reject(n => n== ''),
    R.reduce(removeSpaces,[]),
    R.split('\n'),
);
//console.log('fullPackagesObj',fullPackagesObj(file));
const packageArray:Array<string> = toFullArray(file);

// Separate elements by colon and create key value pairs
const toKeyValuePairs = packageArray.map((element,index)=>{
    let toObjects = {};
    const split = packageArray[index].split(':');
    toObjects[split[0].trim()]=split[1];
    return toObjects
});
//console.log('toKeyValuePairs',toKeyValuePairs);

const showPackagesNames:(file:Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck('Package')
);
//console.log('showPackagesNames',showPackagesNames(toKeyValuePairs));

export const listAllPackagesSorted:Array<string> = showPackagesNames(toKeyValuePairs).sort();
//console.log('listAllPackagesSorted',listAllPackagesSorted);

const showDescriptions:(file:Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck('Description')
);
console.log('showDescriptions',showDescriptions(toKeyValuePairs));

/*
const toPackage = R.compose(
    R.mergeAll,
    toKeyValuePairs,
    toFullArray
);
//console.log('toPackage',toPackage(file));

/!*const singlePackageObj:(file:string) => Object = R.compose(
    //R.mergeAll,
    R.tap(console.log),
    R.map(toKeyValuePairs),


);*!/
//console.log('singlePackageObj',singlePackageObj(file));*/
