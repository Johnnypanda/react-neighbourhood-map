import React, { Component } from "react";
import ListPlaces from "./ListPlaces";

function loadMapJS(src) {
  const ref = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Google Maps can't be loaded, try again later.");
  };
  ref.parentNode.insertBefore(script, ref);
}

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: "",
      infowindow: "",
      prevmarker: "",
      listedPlaces: require("../places.json")
    };
    
    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadMapJS(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDFOULyQ0fkqgA--JAuijn_ynzA1eYs69o&callback=initMap"
    );
  }

  initMap() {
    const self = this;
    const viewMap = document.getElementById("map");
    viewMap.style.height = `${window.innerHeight}px`;
    const map = new window.google.maps.Map(viewMap, {
      center: { lat: 51.1088158, lng: 17.0354424 },
      zoom: 14,
      mapTypeControl: false
    });

    const InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, "closeclick", () => {
      self.closeInfoWindow();
    });

    this.setState({
      map: map,
      infowindow: InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", () => {
      const center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", () => {
      self.closeInfoWindow();
    });

    let listedPlaces = [];
    this.state.listedPlaces.forEach(function(place) {
      let locName = `${place.name} - ${place.type}`;
      let marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          place.latitude,
          place.longitude
        ),
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener("click", () => {
        self.openInfoWindow(marker);
      });

      place.locName = locName;
      place.marker = marker;
      place.display = true;
      listedPlaces.push(place);
    });
    this.setState({
      listedPlaces: listedPlaces
    });
  }

  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      prevmarker: marker
    });
    this.state.infowindow.setContent("Loading Data...");
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -200);
    this.getMarkerInfo(marker);
  }

  getMarkerInfo(marker) {
    const self = this;
    const clientId = "UAZW4BJ540BRMK533SYCVVQPLPB43EUALVP5A0TDXGJRGOC5";
    const clientSecret = "CQYCC5E3IYJYJSNUUVGKQ2TM4YGLE5ENNRBBECBYFW3X1JTI";
    const url =
      `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}
      &v=20130815&ll=${marker.getPosition().lat()},${marker.getPosition().lng()}&limit=1`
    fetch(url).then((response) => {
        if (response.status !== 200) {
          self.state.infowindow.setContent("Sorry data can't be loaded");
          return;
        }

        response.json().then((data) => {
          const locData = data.response.venues[0];
          const place = `<h3>${locData.name}</h3>`;
          const street = `<p>${locData.location.formattedAddress[0]}</p>`;
          let contact = "";
          if (locData.contact.phone)
            contact = `<p><small>${locData.contact.phone}</small></p>`;
          const checkinsCount =`<b>Number of CheckIn's: </b>${locData.stats.checkinsCount}<br>`;
          const readMore =
            `<a href="https://foursquare.com/v/${locData.id}" target="_blank">Read More on <b>Foursquare Website</b></a>'`
          self.state.infowindow.setContent(
            place + street + contact + checkinsCount + readMore
          );
        });
      })
      .catch((err) => {
        self.state.infowindow.setContent("Data can't be loaded");
      });
  }

  closeInfoWindow() {
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null);
    }
    this.setState({
      prevmarker: ""
    });
    this.state.infowindow.close();
  }

  render() {
    return (
      <div>
        <ListPlaces
          key="100"
          listedPlaces={this.state.listedPlaces}
          openInfoWindow={this.openInfoWindow}
          closeInfoWindow={this.closeInfoWindow}
        />
        <div id="map" />
      </div>
    );
  }
}

export default MapContainer;



