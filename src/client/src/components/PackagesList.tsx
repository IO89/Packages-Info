import React,{Component} from 'react';
import axios from 'axios';

export default class PackagesList extends Component {

    componentDidMount(): void {
        const packagesData = axios.get('http://localhost:5000/packages');
        console.log(packagesData);
    }

    render(){
        return(
            <div>List of packages</div>
        )
    }
}

