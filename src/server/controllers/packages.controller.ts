import fs from 'fs';
import R from 'ramda';

// read file and encode to utf-8
const file:string = fs.readFileSync('../../../data/status.real','utf-8');

// Get rid of empty spaces and dots and space breaks
const removeEmptyValue:string = R.reject(n => n== '');
const removeSpaceDot:string = R.reject(n => n== ' .');
const removeNewlineBreak:string = R.split('\n');
//sort alphabetically
const alphabeticalOrder = R.sortBy(R.compose(R.toLower, R.prop('name')));
// Remove special characters from depends field
const removeSpecialCharactersFromDepends =  R.replace(/[^\w\s]/gi, '');


//find single package
const singePackage = R.compose(
    R.fromPairs(),
    R.of(),
    R.slice(1,3),
    R.match(/(.*?)\s(.*)/)
);
//Show package details
const packageDetail = R.compose(
    R.mergeAll,
    R.map(singePackage),
    removeEmptyValue,
    R.split('\n'),
    removeSpecialCharactersFromDepends,
);


// list packages by prop Package
const listAllPackages = R.map(R.prop('Package'));



//console.log('list packages',listAllPackages(file2));
//console.log('parsePackages', packagesList(file));
//console.log('file1', file);
//console.log('file2',file2);
//console.log('signle package',singePackage(file));
//console.log('tokeyValuePairs',toKeyValuePairList(file));
//console.log('segments',toSegments(file));
console.log('packageDetail',packageDetail(file));
//console.log('clean',removeSpecialCharactersFromDepends(file));