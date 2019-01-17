import React,{Component} from 'react';
import axios, {AxiosError, AxiosPromise, AxiosResponse} from 'axios';
import {RouteComponentProps} from "react-router";

interface PackagesDetailProps {
    packageData: AxiosPromise | AxiosResponse | AxiosError,
    componentDidMount:Promise<void>,
    name:Object|string,
    params:any,
    match:any,
}

interface PackagesDetailState {
    package:[] | string[]
}

export default class PackageDetail extends Component<PackagesDetailProps & RouteComponentProps,PackagesDetailState>  {

    state={ package:[] };

    async componentDidMount(){
        const {name} = this.props.match.params;
        const packageData = await axios.get(`http://localhost:5000/packages/${name}`);
        packageData.data ? this.setState({package:packageData.data}):[];
        console.log(this.state.package);

    }
    render(){
        return(
            <div> PackageDetails here!</div>
        )
    }
}