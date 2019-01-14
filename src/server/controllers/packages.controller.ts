import fs from 'fs';
import R from 'ramda';
import { statusReal } from '../../../data';

// read file and encode to utf-8
const file:string = fs.readFileSync(statusReal,'utf-8');
//console.log('file',file);

// move element if it starts with space to one index back
const moveOneIndexBack:(accumulator:Array<string>,element:string) => Array<string> = (accumulator, element) => {
    element.match(/^\s+/g)
        ? accumulator[accumulator.length-1] += element
        : accumulator.push(element);
    return accumulator
};

const groupPackages:(accumulator:Array<string>,element:string) => Array<string> = (accumulator, element) => {
    !element.match(/^Original-Maintainer.*/)
        ? R.splitWhen(R.prop(accumulator[accumulator.length-1]))
        : accumulator.push(element);
   return accumulator
};

// Transform array to contain fields with full description
const toFullArray:(file:string)=> Array<string> = R.compose(
    R.reject(n => n== ''),
    R.reduce(groupPackages,[]),
    //R.reduce(moveOneIndexBack,[]),
    R.split('\n'),
);
console.log('fullPackagesObj',toFullArray(file));

const packageArray:Array<string> = toFullArray(file);

// Separate elements by colon and create key value pairs
const toKeyValuePairs = packageArray.map((element,index)=>{
    let toObjects = {};
    const split = packageArray[index].split(':');
    toObjects[split[0]]=split[1];

    //Create an array of unique depends and cleanup
    if (toObjects['Depends']) {
        const removeSpecialCharacters = R.replace(/(\(.*\))/, '');
        const toDependenciesArray = R.compose(
            R.uniq,
            R.map(removeSpecialCharacters),
            R.split(',')
        );
        toObjects['Depends'] = toDependenciesArray(toObjects['Depends'])
    }
    //console.log('packageArray',toObjects);
    return toObjects
});
//console.log('toKeyValuePairs',toKeyValuePairs);

const separateByMaintainer = R.splitWhen(R.prop('Package'));







const showPackagesNames:(file:Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck('Package')
);
//console.log('showPackagesNames',showPackagesNames(toKeyValuePairs));

const names = showPackagesNames(toKeyValuePairs);

export const listAllPackagesSorted:Array<string> = showPackagesNames(toKeyValuePairs).sort();
//console.log('listAllPackagesSorted',listAllPackagesSorted);

const showDescriptions:(file:Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck('Description')
);
//console.log('showDescriptions',showDescriptions(toKeyValuePairs));
const descriptions = showDescriptions(toKeyValuePairs);

const showDependecies:(file:Object) => Array<string> = R.compose(
  R.reject(R.isNil),
  R.pluck('Depends')
);
//console.log('showDependecies',showDependecies(toKeyValuePairs));
const dependecies = showDependecies(toKeyValuePairs);

const result1 =  R.zipObj(names,descriptions,dependecies);
//console.log('result',result1);

const searchByName = (name) => R.find(R.propEq(name));
//console.log(searchByName('libnfnetlink0')(result1));

const result2 = R.zip(result1,dependecies);
//console.log('result2',result2);