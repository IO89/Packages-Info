import React,{Component} from 'react';
import axios, {AxiosError, AxiosPromise, AxiosResponse} from 'axios';
import {RouteComponentProps} from "react-router";

interface PackageDetailProps {
    packageData: AxiosPromise | AxiosResponse | AxiosError,
    componentDidMount:Promise<void>,
    name:Object|string,
    params:any,
    match:any,
    renderContent:()=>HTMLAllCollection
}

interface PackageDetailState {
    packageName:string,
    packageDescription:string,
    dependencies: [] |string,
    reverseDependencies: []| string
}

export default class PackageDetail extends Component<PackageDetailProps & RouteComponentProps,PackageDetailState|{}>  {
    state =  {
        packageName: '',
        packageDescription: '',
        dependencies: [],
        reverseDependencies:[]
    };

    async componentDidMount(){
        const {name} = this.props.match.params;
        const packageData = await axios.get(`http://localhost:5000/packages/${name}`);
        packageData.data.Package ? this.setState({packageName:packageData.data.Package}) : '';
        packageData.data.Description ? this.setState({packageDescription:packageData.data.Description}) : '';
    }

   /* static renderContent(){
        return <div> PackageDetails here!</div>
    }*/

    render(){
        return(
            <div className="ui centered card">
                <div className="content">
                    <div className="header">{this.state.packageName}</div>
                    <div className="description">
                        <p>{this.state.packageDescription}</p>
                    </div>
                </div>
            </div>

        )
    }
}