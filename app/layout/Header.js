import React from "react";
import { Link } from "react-router";

export default class Header extends React.Component {
  render() {
    return (
      <Link to="/"><h1>dotons header</h1></Link>
    );
  }
}
