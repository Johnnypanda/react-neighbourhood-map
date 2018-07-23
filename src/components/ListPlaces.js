import React, { Component } from "react";
import Place from "./Place";

class ListPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: "",
      query: ""
    };

    this.filterPlaces = this.filterPlaces.bind(this);
  }

  filterPlaces(event) {
    this.props.closeInfoWindow();
    const { value } = event.target;
    let places = [];
    this.props.listedPlaces.forEach(function(location) {
      if (location.locName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        places.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      places: places,
      query: value
    });
  }

  componentWillMount() {
    this.setState({
      places: this.props.listedPlaces
    });
  }

  render() {
    const listPlaces = this.state.places.map((listItem, index) => {
      return (
        <Place
          key={index}
          openInfoWindow={this.props.openInfoWindow.bind(this)}
          data={listItem}
        />
      );
    }, this);

    return (
      <div className="search-area">
        <input
          role="search"
          aria-labelledby="filter"
          id="search-field"
          className="search-input"
          type="text"
          placeholder="Filter"
          value={this.state.query}
          onChange={this.filterPlaces}
        />
        <ul className="places-list">
          {listPlaces}
        </ul>
      </div>
    );
  }
}

export default ListPlaces;