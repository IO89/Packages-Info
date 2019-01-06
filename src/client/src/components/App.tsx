import * as React from 'react';
import {Header} from './Header';

import PackagesList from "./PackagesList";


interface AppProps {
    name: string;
    age: number;
}

export class App extends React.Component<AppProps, {}>{
   public render(){
        return(
            <div>
                <Header/>
                App, {this.props.name}, you are {this.props.age}
                <PackagesList/>
            </div>
        );
    }
}