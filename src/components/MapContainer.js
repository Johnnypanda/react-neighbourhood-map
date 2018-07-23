import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import ListPlaces from "./ListPlaces";


class MapContainer extends Component {
  // state = {
  //   activeMarker: {},
  //   selectedPlace: {},
  //   listedPlaces: require("../places.json"),
  //   showingInfoWindow: false
  // };

  constructor(props) {
    super(props);
    this.state = {
      activeMarker: {},
      selectedPlace: {},
      showingInfoWindow: false,
      listedPlaces: require("../places.json")
    };
  }


  onMarkerClick = (props, marker) =>
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true
    });

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });

  onMapClicked = () => {
    if (this.state.showingInfoWindow)
      this.setState({
        activeMarker: null,
        showingInfoWindow: false
      });
  };

  render() {
    if (!this.props.loaded) return <div>Loading...</div>;

    return (
      <Map
        className="map"
        google={this.props.google}
        onClick={this.onMapClicked}
        style={{ height: '100%', position: 'relative', width: '100%' }}
        zoom={14}
        initialCenter={{
          lat: 51.1086047,
          lng: 17.0268456
        }}
        >
        
        
        {this.state.listedPlaces.map((place) => (
        <Marker
          key={place.name}
          name={place.name}
          onClick={this.onMarkerClick}
          position={{lat: place.lat, lng: place.lon}}
        />
        ))}

        <InfoWindow
          marker={this.state.activeMarker}
          onClose={this.onInfoWindowClose}
          visible={this.state.showingInfoWindow}>
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }


}
export default GoogleApiWrapper({
  apiKey: ('AIzaSyDFOULyQ0fkqgA--JAuijn_ynzA1eYs69o')
})(MapContainer)



