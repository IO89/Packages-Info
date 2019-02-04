import * as React from "react";
import { Header } from "./Header";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import PackagesList from "./PackagesList";
import PackagesDetail from "./PackagesDetail";

export const App = () =>{
    return (
      <div>
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={PackagesList} />
              <Route exact path="/packages/:name" component={PackagesDetail} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
};
