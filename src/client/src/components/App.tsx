import * as React from 'react';
import {Header} from './Header';

import PackagesList from "./PackagesList";


interface AppProps {
    name: string;
    age: number;
}

export class App extends React.Component<AppProps, {}>{
    render(){
        return(
            <div>
                <Header/>
                <PackagesList />
            </div>
        );
    }
}