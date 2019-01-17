import * as React from 'react';
import {Header} from './Header';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import PackagesList from "./PackagesList";
import PackagesDetail from "./PackagesDetail";


interface AppProps {
    name: string;
    age: number;
}

export class App extends React.Component<AppProps, {}>{
    render(){
        return(
            <div>
                <BrowserRouter>
                    <div>
                    <Header/>
                    <Route exact path="/" component={PackagesList} />
                    <Route exact path="/packages/:name" componet={PackagesDetail} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}