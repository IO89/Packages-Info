import fs from "fs";
import R from "ramda";
import {statusReal} from "../../../data";

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
// --------- find reverse dependencies and merge them to packages --------------
//
/*const extractName = R.compose(
    R.prop('Package'),
    toSeparatePackage
);

// Find where packages where Package name is in Depends field
const searchNameDepends = R.compose(
    R.filter(
        R.where({
            Depends: R.includes(extractName(file))
        }))
);*/

// build an array with dependencies and reverse dependencies
const withDependencies: (file: string) => Array<Object> = R.compose(
    // R.map(R.mergeDeepLeft({'Reverse-Depends': searchNameDepends})),
    dependsCheck,
    toSeparatePackage
);

// -------------- Separate by newline breaks and Iterate trough file and transform all packages ---------------
const convertAllPackages: (file: string) => Array<Object> = R.compose(
    R.map(withDependencies),
    R.split("\n\n")
);

const Packages = convertAllPackages(file);
console.log('All packages',Packages);

const showPackagesNames: (file: Object) => Array<string> = R.compose(
    R.reject(R.isNil),
    R.pluck("Package")
);

export const listAllPackagesSorted: Array<string> = showPackagesNames(Packages).sort();

export const searchByName: (name: string) => Object = name =>
    R.find(R.propEq("Package", name))(Packages);

