import React,{Component} from 'react';
import axios, {AxiosError, AxiosPromise, AxiosResponse} from 'axios';

interface PackagesListProps {
    packagesData: AxiosPromise | AxiosResponse | AxiosError,
    element:string,
    index:number

}
interface PackagesListState {
    packages:[] | string[]
}

export default class PackagesList extends Component <PackagesListProps|{},PackagesListState> {
    state = { packages :[] };

    async componentDidMount():Promise<void> {
        const packagesData = await axios.get('http://localhost:5000/packages');
        packagesData.data ? this.setState({packages:packagesData.data}):[];
    }

    render(){
        return(
            <div className="ui link list">
                {this.state.packages.map((element, index) => <a className="item" style={{textAlign:'center'}} key={index}>{element}</a>)}
            </div>
        )
    }
}

