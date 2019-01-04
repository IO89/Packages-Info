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

//find single package
const singePackage = R.compose(
    R.slice(0,1),
    removeEmptyValue,
    removeSpaceDot,
    removeNewlineBreak
);


//parse packages list
const packagesList = R.compose(
    R.map(singePackage),
    removeEmptyValue,
    removeSpaceDot,
    removeNewlineBreak
);


// Find by name
const findPackage = (name) => {
    R.map(R.propEq('Package',name));
};

// list packages by prop Package
const listAllPackages = R.map(R.prop('Package'));



//console.log('list packages',listAllPackages(file2));
//console.log('parsePackages', packagesList(file));
//console.log('file1',typeof file);
//console.log('file2',file2);
console.log('signle package',singePackage(file));
//console.log('tokeyValuePairs',typeof toKeyValuePairList(file));
//console.log('segments',toSegments(file));

