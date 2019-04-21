import React, { useState, useEffect} from "react";
import axios, {AxiosError, AxiosPromise, AxiosResponse} from "axios";
import {Link} from "react-router-dom";

interface PackagesListProps {
    packagesData: AxiosPromise | AxiosResponse | AxiosError;
    element: string;
    index: number;
    componentDidMount: Promise<void>;
    renderPackages: () => HTMLAllCollection;
}

interface PackagesListState {
    packages: [] | string[];
}

const PackagesList = () => {
    const [packages, setPackages] = useState([]);

    const fetchPackages = async () => {
        const packagesData = await axios.get("/api/packages");
        packagesData.data ? setPackages(packagesData.data) : [];
    };

    useEffect(() => {
        fetchPackages()
    }, []);

    return (
        <div className="ui link list">
            {packages.map((name, index) => (
                <Link
                    to={`/packages/${name}`}
                    className="item"
                    style={{textAlign: "center"}}
                    key={index}
                >
                    {name}
                </Link>
            ))}
        </div>
    );

};
export default PackagesList;
