import fs from 'fs';
import R from 'ramda';

// read file and encode to utf-8
const file = fs.readFileSync('../../../data/status.real','utf-8');

//parse package
const isEmptyValue = R.reject(n => n=='');

const parsePackage = R.compose(
    isEmptyValue,
    R.split('\n')
);


// sort alphabetically
const aplhabeticalOrder = R.sortBy(R.compose(R.toLower, R.prop('name')));


// Find by name
const findPackage = (name) => {
    R.map(R.propEq('Package',name));
};

// list packages by prop Package
const listAllPackages = R.map(R.prop('Package'));



//console.log('list packages',listAllPackages(file2));
console.log('parsePackages', parsePackage(file));
//console.log('file1',file);
//console.log('file2',file2);
