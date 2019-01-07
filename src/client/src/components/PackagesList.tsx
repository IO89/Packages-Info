import React,{Component} from 'react';
import axios, {AxiosError, AxiosPromise, AxiosResponse} from 'axios';

interface PackagesListProps {
    packages:[] | string[],
    getPackagesList: string[],
    packagesData: AxiosPromise | AxiosResponse | AxiosError,
    element:string,
    index:number

}

export default class PackagesList extends Component <PackagesListProps| {}> {
    state = { packages :[] };

   async componentDidMount():Promise<void> {
        const packagesData = await axios.get('http://localhost:5000/packages');
        packagesData.data ? this.setState({packages:packagesData.data}):[];
    }

    render(){
        return(
            <div>
                {this.state.packages.map((element, index) => <li className="item" key={index}>{element}</li>)}
            </div>
        )
    }
}

