"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var ramda_1 = __importDefault(require("ramda"));
var data_1 = require("../../../data");
// read file and encode to utf-8
var file = fs_1.default.readFileSync(data_1.statusReal, 'utf-8');
// Get rid of empty spaces and dots and space breaks
var removeEmptyValue = ramda_1.default.reject(function (n) { return n == ''; });
var removeUndefinedValue = ramda_1.default.reject(function (n) { return n == undefined; });
// Remove special characters from depends field
var removeSpecialCharactersFromDepends = ramda_1.default.replace(/[^\w\s]/gi, '');
//find single package
var singlePackageObj = ramda_1.default.compose(ramda_1.default.fromPairs(), ramda_1.default.of(), ramda_1.default.slice(1, 3), ramda_1.default.match(/(.*?)\s(.*)/));
//Show package details
var packageDetail = ramda_1.default.compose(ramda_1.default.mergeAll, ramda_1.default.map(singlePackageObj), removeEmptyValue, ramda_1.default.split('\n'), removeSpecialCharactersFromDepends);
//show all packages
var listAllPackages = ramda_1.default.compose(removeUndefinedValue, ramda_1.default.pluck('Package'), ramda_1.default.map(packageDetail), removeEmptyValue, ramda_1.default.split('\n'));
exports.listAllPackagesSorted = listAllPackages(file).sort();
var findPackage = ramda_1.default.find(ramda_1.default.propEq('Package', 'Name of package')(file));
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
