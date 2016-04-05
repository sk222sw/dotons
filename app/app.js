import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flashMessage: ""
    };
  }

  render() {
    return (
      <div>
        {
          <p>{this.state.flashMessage}</p>
        }
        <p>Hej!</p>
      </div>
    );
  }
}
