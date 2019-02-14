import fs from "fs";
import R from "ramda";
import {statusReal} from "../../../data";
import {element} from "prop-types";

const file: string = fs.readFileSync(statusReal, "utf-8");

// ------------------ Create an array of packages objects -------------------------
//
// move element if it starts with space to one index back
const moveOneIndexBack: (accumulator: Array<string>, element: string) => Array<string> = (accumulator, element) => {
    element.match(/^ .*/)
        ? (accumulator[accumulator.length - 1] += element)
        : accumulator.push(element);
    return accumulator;
};

// Create array separated by line breaks and move values to description
const splitByKeyValuePairs: (file: string) => Array<string> = R.compose(
    R.reject(n => n == ""),
    R.reduce(moveOneIndexBack, []),
    R.split("\n")
);

// Tokenize key:value pair and convert them to object
const extractKeyPair: (file: string) => Object = R.compose(
    R.fromPairs(),
    R.of(),
    R.slice(1, 3),
    R.split(/(.+?):\s(.*)/)
);

// Transform one full package to an Object with key value pairs
const toSeparatePackage: (file: string) => Array<Object> = R.compose(
    R.mergeAll,
    R.map(extractKeyPair),
    splitByKeyValuePairs
);

// ------------------- Build dependencies into array and remove special characters in brackets ---------------
//
const removeSpecialCharacters = R.compose(
    R.trim,
    R.replace(/\(.*\)/, "")
);

const toDependenciesArray = R.compose(
    R.map(removeSpecialCharacters),
    R.chain(R.split("|")),
    R.split(",")
);

// Check if Depends field if empty
const emptyDepends = R.compose(
    R.isNil,
    R.path(["Depends"])
);

// Partial apply lens  where Depends field exists
const dependsCheck: (file: string) => Array<Object> = R.ifElse(
    emptyDepends,
    R.identity,
    R.over(R.lensPath(["Depends"]), toDependenciesArray)
);

// build an array with dependencies
const withDependencies: (file: string) => Array<Object> = R.compose(
    dependsCheck,
    toSeparatePackage
);

// -------------- Separate by newline breaks and Iterate trough file and transform all packages ---------------
const convertAllPackages: (file: string) => Array<Object> = R.compose(
    R.map(withDependencies),
    R.split("\n\n")
);

// --------- find reverse dependencies and merge them to packages --------------
//
const extractNames:(file:string) => Array<string> = R.compose(
    R.map(R.prop('Package')),
    withDependencies,
);
const extractName = R.compose(
    R.prop('Package'),
    withDependencies
);

// Find where packages where Package name is in Depends field and remove where depends is empty
const searchNameDepends = R.compose(
    R.filter(R.where({
        Depends: R.includes(extractName(file))
    })),
    R.reject(emptyDepends)
);
// console.log('search',searchNameDepends(convertAllPackages(file)));

// build an array of reverse dependencies
const reverseDependenciesArray = R.compose(
    R.map(R.prop('Package')),
    searchNameDepends
);
// console.log('reverse',reverseDependenciesArray(convertAllPackages(file)));
// Merge reverse depends into packages
const mergeReverseDepends = R.compose(
    R.map(R.mergeDeepLeft({'Reverse-Depends':reverseDependenciesArray(convertAllPackages(file))})),
    convertAllPackages
);

console.log('res',mergeReverseDepends(file));

const showPackagesNames: (file: Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck("Package")
);

const allPackages = showPackagesNames(file);
// console.log('should be final result',allPackages);

export const listAllPackagesSorted: Array<string> = allPackages.sort();

export const searchByName: (name: string) => Object = name =>
    R.find(R.propEq("Package", name))(allPackages);