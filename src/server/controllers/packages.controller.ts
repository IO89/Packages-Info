import fs from 'fs';
import R from 'ramda';

// read file and encode to utf-8
const file:string = fs.readFileSync('../../../data/status.real','utf-8');

// Get rid of empty spaces and dots and space breaks
const removeEmptyValue:string = R.reject(n => n== '');
const removeUndefinedValue:string = R.reject(n => n== undefined);

// Remove special characters from depends field
const removeSpecialCharactersFromDepends =  R.replace(/[^\w\s]/gi, '');

//find single package
const singlePackageObj = R.compose(
    R.fromPairs(),
    R.of(),
    R.slice(1,3),
    R.match(/(.*?)\s(.*)/)
);
//Show package details
const packageDetail = R.compose(
    R.mergeAll,
    R.map(singlePackageObj),
    removeEmptyValue,
    R.split('\n'),
    removeSpecialCharactersFromDepends,

);
//show all packages
const listAllPackages =
    R.compose(
        removeUndefinedValue,
        R.pluck('Package'),
        R.map(packageDetail),
        removeEmptyValue,
        R.split('\n'),
    );

const listAllPackagesSorted = listAllPackages(file).sort();

const findPackage= R.find(
    R.propEq('Package','Name of package')(file)
);


//console.log('list packages',listAllPackages(packageDetail(file)));
//console.log('parsePackages', packagesList(file));
//console.log('file1', file);
//console.log('file2',file2);
//console.log('signle package',singePackage(file));
//console.log('tokeyValuePairs',toKeyValuePairList(file));
//console.log('segments',toSegments(file));
//console.log('packageDetail',packageDetail(file));
//console.log('clean',removeSpecialCharactersFromDepends(file));
//console.log('noDependecies',hasNoDependencies(file));
//console.log('listallPackages',listAllPackages(file));
console.log('list all sorted packages',listAllPackagesSorted);