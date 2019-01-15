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
// Transform array to contain fields with full description
const toFullArray:(file:string)=> Array<string> = R.compose(
    R.reject(n => n== ''),
    //R.reduce(groupPackages,[]),
    R.reduce(moveOneIndexBack,[]),
    R.split('\n'),
);
//console.log('fullPackagesObj',toFullArray(file));

const packageArray:Array<string> = toFullArray(file);

// Separate elements by colon and create key value pairs
const toKeyValuePairs = packageArray.map((element,index)=>{
    let toObjects = {};
    const split = packageArray[index].split(':');
    toObjects[split[0]]=split[1];
    //console.log('packageArray',toObjects);
    return toObjects
});
//console.log('toKeyValuePairs',toKeyValuePairs);

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

const packagesDescriptions:(packagesNames:Object,descriptions:Object)=>Object =  R.zipObj(packagesNames,descriptions);
console.log('packagesDescriptions',packagesDescriptions);

const searchByName:(name:string)=> Object = (name) => R.find(R.propEq(name));
//console.log(searchByName('name')(result1));

