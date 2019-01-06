import fs from 'fs';
import R from 'ramda';
import { statusReal } from '../../../data';

// read file and encode to utf-8
const file:string = fs.readFileSync(statusReal,'utf-8');

// Get rid of empty spaces and dots and space breaks
const removeEmptyValue:(file:string)=> string = R.reject(n => n== '');
const removeUndefinedValue:(file:string)=> string = R.reject(n => n== undefined);

// Remove special characters from depends field
const removeSpecialCharactersFromDepends:(file:string)=> string = R.replace(/[^\w\s]/gi, '');

//find single package
const singlePackageObj:(file:string) => Array<string> = R.compose(
    R.fromPairs(),
    R.of(),
    R.slice(1,3),
    R.match(/(.*?)\s(.*)/)
);
//Show package details
const packageDetail:(file:string) => Array<string> = R.compose(
    R.mergeAll,
    R.map(singlePackageObj),
    removeEmptyValue,
    R.split('\n'),
    removeSpecialCharactersFromDepends,

);
//show all packages
const listAllPackages:(file:string)=> Array<string> = R.compose(
        removeUndefinedValue,
        R.pluck('Package'),
        R.map(packageDetail),
        removeEmptyValue,
        R.split('\n'),
    );

export const listAllPackagesSorted:Array<string> = listAllPackages(file).sort();

const findPackage= R.find(
    R.propEq('Package','Name of package')(file)
);


//console.log('list packages',listAllPackages(packageDetail(file)));
//console.log('parsePackages', packagesList(file));
//console.log('file1', file);
//console.log('file2',file2);
//console.log('signle package',singlePackageObj(file));

//console.log('packageDetail',packageDetail(file));
//console.log('clean',removeSpecialCharactersFromDepends(file));
//console.log('noDependecies',hasNoDependencies(file));
//console.log('listallPackages',listAllPackages(file));
//console.log('list all sorted packages',listAllPackagesSorted);
