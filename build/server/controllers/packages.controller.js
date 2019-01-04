"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var ramda_1 = __importDefault(require("ramda"));
// read file and encode to utf-8
var file = fs_1.default.readFileSync('../../../data/status.real', 'utf-8');
// Get rid of empty spaces and dots and space breaks
var removeEmptyValue = ramda_1.default.reject(function (n) { return n == ''; });
var removeSpaceDot = ramda_1.default.reject(function (n) { return n == ' .'; });
var removeNewlineBreak = ramda_1.default.split('\n');
//sort alphabetically
var alphabeticalOrder = ramda_1.default.sortBy(ramda_1.default.compose(ramda_1.default.toLower, ramda_1.default.prop('name')));
//find single package
var singePackage = ramda_1.default.compose(ramda_1.default.slice(0, 1), removeEmptyValue, removeSpaceDot, removeNewlineBreak);
//parse packages list
var packagesList = ramda_1.default.compose(ramda_1.default.map(singePackage), removeEmptyValue, removeSpaceDot, removeNewlineBreak);
// Find by name
var findPackage = function (name) {
    ramda_1.default.map(ramda_1.default.propEq('Package', name));
};
// list packages by prop Package
var listAllPackages = ramda_1.default.map(ramda_1.default.prop('Package'));
//console.log('list packages',listAllPackages(file2));
//console.log('parsePackages', packagesList(file));
console.log('file1', typeof file);
//console.log('file2',file2);
//console.log('signle package',singePackage(file));
