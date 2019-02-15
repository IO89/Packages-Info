import React, {Component} from "react";
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

export default class PackageDetail extends Component<PackageDetailProps & RouteComponentProps,
    PackageDetailState | {}> {
    state = {
        packageName: "",
        packageDescription: "",
        dependencies: [],
        reverseDependencies: []
    };

    async componentDidMount() {
        const {name} = this.props.match.params;
        const packageData = await axios.get(`/api/packages/${name}`);
        packageData.data.Package ? this.setState({packageName: packageData.data.Package}) : "";
        packageData.data.Description ? this.setState({packageDescription: packageData.data.Description}) : "";
        packageData.data.Depends ? this.setState({dependencies: packageData.data.Depends}) : [];
        packageData.data.rDepends? this.setState({reverseDependencies: packageData.data.rDepends}) : [];
    }

    render() {
        return (
            <div>
                <div className="ui centered card">
                    <div className="content">
                        <div className="header">{this.state.packageName}</div>
                        <div className="description">
                            <p>{this.state.packageDescription}</p>
                        </div>
                    </div>
                </div>
                <div className="ui link list">
                    <h4 style={{textAlign: "center"}} className="ui header">
                        Dependencies
                    </h4>
                    {this.state.dependencies.map((name, index) => (
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
                    {this.state.reverseDependencies.map((name, index) => (
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
    }
}
