import React, { Component } from "react";
import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import { Link } from "react-router-dom";

interface PackagesListProps {
  packagesData: AxiosPromise | AxiosResponse | AxiosError;
  element: string;
  index: number;
  componentDidMount: Promise<void>;
  renderPackages: () => HTMLAllCollection;
}

interface PackagesListState {
  packages: [] | string[];
}

export default class PackagesList extends Component<
  PackagesListProps | {},
  PackagesListState
> {
  state = { packages: [] };

  async componentDidMount() {
    const packagesData = await axios.get("http://localhost:5000/packages");
    packagesData.data ? this.setState({ packages: packagesData.data }) : [];
  }

  render() {
    return (
      <div className="ui link list">
        {this.state.packages.map((name, index) => (
          <Link
            to={`/packages/${name}`}
            className="item"
            style={{ textAlign: "center" }}
            key={index}
          >
            {name}
          </Link>
        ))}
      </div>
    );
  }
}
