import React, { Component } from "react";

class ListPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listedPlaces: require("../places.json")
    };
  }

  render(){
    return(
      <div className="search">

      </div>
    )
  }
}

export default ListPlaces;