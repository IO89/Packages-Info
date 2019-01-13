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
/*const groupByPackages:(accumulator:Array<string>,element:string) => Array<string> = (accumulator, element) => {
    element.match('Package')
    ? accumulator[accumulator.length] += element
        : accumulator.push(element);
    return accumulator
};*/

// const fullPackage = R.reduce(groupByHomePage,{});
// Transform array to contain fields with full description
const toFullArray:(file:string)=> Array<string> = R.compose(
    R.reject(n => n== ''),
    R.reduce(moveOneIndexBack,[]),
    //R.reduce(groupByPackages,[]),
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
/*const check = R.groupBy(R.prop('Package'))(toKeyValuePairs);
console.log(check);*/



const searchByName = (name) => R.find(R.propEq({'Package': name }));

//console.log('searchByName',searchByName('libslf4j-java')(toKeyValuePairs));

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
//console.log('showDescriptions',showDescriptions(toKeyValuePairs));

