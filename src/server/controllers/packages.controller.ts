import fs from 'fs';
import R from 'ramda';
import { statusReal } from '../../../data';

// read file and encode to utf-8
const file:string = fs.readFileSync(statusReal,'utf-8');

// Get rid of empty spaces and dots and space breaks
const removeEmptyValue:(file:string)=> string = R.reject(n => n== '');
const removeUndefinedValue:(file:string)=> string = R.reject(n => n== undefined);
const removeDotAndSpaceValue:(file:string)=>string = R.reject(n => n==' .');

// Remove special characters from depends field
const removeSpecialCharactersFromDepends:(file:string)=> string = R.replace(/[^\w\s]/gi, '');

//find single package:name value pair
const packageKeyPair:(file:string) => Object = R.compose(
    R.fromPairs(),
    R.of(),
    R.slice(1,3),
    R.match(/(.*?)\s(.*)/)
);
//Show package details
const singlePackageObj:(file:string) => Object = R.compose(
    R.mergeAll,
    R.map(packageKeyPair),
    removeEmptyValue,
    R.split('\n'),
    removeSpecialCharactersFromDepends,

);
//show all packages names
const listAllPackages:(file:string)=> Array<string> = R.compose(
        removeUndefinedValue,
        R.pluck('Package'),
        R.map(singlePackageObj),
        removeEmptyValue,
        R.split('\n'),
    );
// sort alphabetically
export const listAllPackagesSorted:Array<string> = listAllPackages(file).sort();

const searchByName:(name:string) => Object = R.compose(
    R.find(R.propEq('Package', 'makedev')),
    R.map(singlePackageObj),
    removeDotAndSpaceValue,
    removeEmptyValue,
    R.split('\n'),
);

const showDescriptionFiled:(file:string) => Array<string> = R.compose(
    removeUndefinedValue,
    R.pluck('Description'),
    R.map(singlePackageObj),
    removeEmptyValue,
    R.split('\n'),
);


//console.log('list packages',listAllPackages(packageDetail(file)));
//console.log('parsePackages', packagesList(file));
//console.log('file1', file);

//console.log('signle package',packageKeyPair(file));

//console.log('packageDetail',singlePackageObj(file));
//console.log('clean',removeSpecialCharactersFromDepends(file));
//console.log('noDependecies',hasNoDependencies(file));
//console.log('listallPackages',listAllPackages(file));
//console.log('list all sorted packages',listAllPackagesSorted);

//console.log('findPackage makedev',searchByName(file));
//console.log('search',search(file));
//console.log('Description',showDescriptionFiled(file));
//console.log('PackagesWithDescription',PackagesWithDescription(file));

