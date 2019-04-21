import React, {Component, useEffect, useState} from "react";
import axios, {AxiosError, AxiosPromise, AxiosResponse} from "axios";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";

interface PackageDetailProps {
    packageData: AxiosPromise | AxiosResponse | AxiosError;
    componentDidMount: Promise<void>;
    name: Object | string;
    params: any;
    match: any;
}

interface PackageDetailState {
    packageName: string;
    packageDescription: string;
    dependencies: [] | string;
    reverseDependencies: [] | string;
}

const PackagesDetail = (props: any) => {
    const [packageName, setPackageName] = useState('');
    const [packageDescription, setPackageDescription] = useState('');
    const [dependencies, setDependencies] = useState([]);
    const [reverseDependencies, setReverseDependencies] = useState([]);

    const fetchPackages = async () => {
        const {name} = props.match.params;
        const packageData = await axios.get(`/api/packages/${name}`);
        packageData.data.Package ? setPackageName(packageData.data.Package) : "";
        packageData.data.Description ? setPackageDescription(packageData.data.Description) : "";
        packageData.data.Depends ? setDependencies(packageData.data.Depends) : [];
        packageData.data.reverseDepends ? setReverseDependencies(packageData.data.reverseDepends) : [];
    };
    useEffect(() => {
        fetchPackages()
    }, []);


    return (
        <div className="ui container">
            <div className="ui centered card">
                <div className="content">
                    <div className="header">{packageName}</div>
                    <div className="description">
                        <p>{packageDescription}</p>
                    </div>
                </div>
            </div>
            <div className="ui link list">
                <h4 style={{textAlign: "center"}} className="ui header">
                    Dependencies
                </h4>
                {dependencies.map((name, index) => (
                    <Link
                        to={`/packages/${name}`}
                        target="_self"
                        className="item"
                        style={{textAlign: "center"}}
                        key={index}
                    >
                        {name}
                    </Link>
                ))}
            </div>
            <div className="ui link list">
                <h4 style={{textAlign: "center"}} className="ui header">
                    Reverse Dependencies
                </h4>
                {reverseDependencies.map((name, index) => (
                    <Link
                        to={`/packages/${name}`}
                        target="_self"
                        className="item"
                        style={{textAlign: "center"}}
                        key={index}
                    >
                        {name}
                    </Link>
                ))}
            </div>
        </div>
    );
};
export default PackagesDetail
