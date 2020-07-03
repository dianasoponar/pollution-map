import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import Geocode from "react-geocode";
import './App.css';
import * as Icon from 'react-bootstrap-icons';
import ReactStars from "react-rating-stars-component";
import { FaSatelliteDish } from "react-icons/fa";

export class App extends Component{
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: {
        latitude: null,
        longitude: null,
        address: null,
        airQality: null,
        airRating: null,
      },
      markers: [{
        latitude: 55.6813442,
        longitude: 12.5837843,
        address: 'Ny Adelgade 6-12, 1107 København',
        info: 'Enjoy your usual outdoor activities.',
        pollutionIndex: 211.5,
      },
      {
        latitude: 55.6863442,
        longitude: 12.5937843,
        address: 'Amaliegade 29B, 1256 København',
        info: 'Air quality is  acceptable.',
        pollutionIndex: 314.25,
      },
      {
        latitude: 55.6873442,
        longitude: 12.5737843,
        address: 'Indre By, 1353 Copenhagen Municipality',
        info: 'Air quality is  acceptable.',
        pollutionIndex: 356.5,
      },
      {
        latitude: 55.6763442,
        longitude: 12.5946843,
        address: 'Wilders Pl. 13, 1403 København',
        info: 'Enjoy your usual outdoor activities.',
        pollutionIndex: 279.2,
      },
      {
        latitude: 55.6713442,
        longitude: 12.5737843,
        address: 'Anker Heegaards Gade 7-1, 1572 København',
        info: 'May be unhealty for sensitive groups.',
        pollutionIndex: 604.11,
      },
      {
        latitude: 55.6773442,
        longitude: 12.6137843,
        address: 'Lindegang, 2300 København',
        info: 'Unhealty. Try to reduce your outdoor activities.',
        pollutionIndex: 945.84,
      },
      {
        latitude: 55.668492,
        longitude: 12.626053,
        address: 'Yderlandsvej 27-3 2300 København ',
        info: 'May be unhealty for sensitive groups.',
        pollutionIndex: 701.7,
      },
      {
        latitude: 55.6743442,
        longitude: 12.5935842,
        address: 'Overgaden Neden Vandet 51B, 1414 København',
        info: 'Enjoy your usual outdoor activities.',
        pollutionIndex: 210.23,
      },
      {
        latitude: 55.6908152,
        longitude: 12.5323703,
        address: 'Mariendalsvej 57, 2000 Frederiksberg',
        info: 'Enjoy your usual outdoor activities.',
        pollutionIndex: 201.3,
      },
      {
        latitude: 55.6961966,
        longitude: 12.5354282,
        address: 'Lundtoftegade 77, 2200 København',
        info: 'Air quality is  acceptable.',
        pollutionIndex: 345.9,
      },
      {
        latitude: 55.690216, 
        longitude: 12.517390,
        address: 'Godthåbsvej 176 2000 Frederiksberg',
        info: 'Air quality is  acceptable.',
        pollutionIndex: 501.6,
      },
    ],
    map: {
      activeMarker: {},
      showingInfoWindow: false,
      selectedPlace : {
        address: null,
        info: null,
        pollutionIndex: null,
      }
    },
    ratings: [
      {
        latitude: 55.6743442,
        longitude: 12.5935842,
        rating: 4,
      },
    ],
    }

    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey("AIzaSyBESc_iTGS2Qys0bHcjeChJk9WChsHp4bI");
    
    // set response language. Defaults to english.
    Geocode.setLanguage("en");
    
    // set response region. Its optional.
    // A Geocoding request with region=es (Spain) will return the Spanish city.
    Geocode.setRegion("dk");

    this.getLocation();
    this.getPollution();
  }

  getPollution = () => {
    fetch("https://api.thingspeak.com/channels/475700/feeds.json?results=1")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            currentLocation: {
              airQality: result["feeds"][0]["field1"],
              address: this.state.currentLocation.address,
              latitude: this.state.currentLocation.latitude,
              longitude: this.state.currentLocation.longitude,
              airRating: this.state.currentLocation.airRating,
            }
          }, () => console.log(this.state.currentLocation.airQality));
        },
        (error) => {
          console.error(error);
        }
      )
  }

  getLocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      position => {
        // Get address from latidude & longitude.
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
          response => {
            this.setState({
              currentLocation: {
                airQality: this.state.currentLocation.airQality,
                address: response.results[0].formatted_address,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                airRating: this.state.currentLocation.airRating,
              }
            }, () => console.log(this.state.currentLocation.address));
          },
          error => {
            console.error(error);
          }
        );
      }, 
      err => console.log(err)
    );
  }

  displayMarkers = () => {
    return this.state.markers.map((marker, index) => {
      let urlMarker;
      if (marker.pollutionIndex <= 300) 
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      else if (marker.pollutionIndex > 300 && marker.pollutionIndex <= 600)
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
      else if (marker.pollutionIndex > 600 && marker.pollutionIndex <= 900)
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
      else if (marker.pollutionIndex > 900 && marker.pollutionIndex <= 1200)
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      else if (marker.pollutionIndex > 1200 )
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
      
      return <Marker 
        key={index} 
        id={index} 
        position={{
          lat: marker.latitude,
          lng: marker.longitude
        }}
        icon= {{url: urlMarker}}
        onClick={this.onMarkerClick} />
    })
  }

  onMarkerClick = (props, marker) => {
    this.setState({
      map: {
        activeMarker: marker,
        showingInfoWindow: true,
        selectedPlace: {
          address: this.state.markers[marker['id']].address,
          info: this.state.markers[marker['id']].info,
          pollutionIndex: this.state.markers[marker['id']].pollutionIndex,
        }
      }
    }, () => console.log(this.state.map));  
  };

  onInfoWindowClose = () =>
    this.setState({
      map: {
        activeMarker: null,
        showingInfoWindow: false,
        selectedPlace: {
          address: null,
          info: null,
          pollutionIndex: null,
        }
      }
    });

  onMapClicked = () => {
    if (this.state.showingInfoWindow)
      this.setState({
        map: {
          activeMarker: null,
          showingInfoWindow: false,
          selectedPlace: {
            address: null,
            info: null,
            pollutionIndex: null,
          }
        }
      });
  };

  addEmoji = (airQuality) => {
    if (airQuality <= 300)
      return <Icon.EmojiLaughing style={{color: "#28CE5B", width: "2em", height: "2em"}}/>
    else if (airQuality > 300 && airQuality <= 600)    
      return <Icon.EmojiSmile style={{color: "#C7DB35", width: "2em", height: "2em"}}/>
    else if (airQuality > 600 && airQuality <= 900)
      return <Icon.EmojiNeutral style={{color: "orange", width: "2em", height: "2em"}}/>
    else if (airQuality > 900 && airQuality <= 1200)
      return <Icon.EmojiFrown style={{color: "#ED4034", width: "2em", height: "2em"}}/>
    else if (airQuality > 1200 )
      return <Icon.EmojiAngry style={{color: "#8B1EE0", width: "2em", height: "2em"}}/>
  }

  submitRating = (rating) => {
    this.setState({
      currentLocation: {
        airQality: this.state.currentLocation.airQality,
        address: this.state.currentLocation.address,
        latitude: this.state.currentLocation.latitude,
        longitude: this.state.currentLocation.longitude,
        airRating: rating,
      },
      ratings: [...this.state.ratings, {
        latitude: this.state.currentLocation.latitude,
        longitude: this.state.currentLocation.longitude,
        rating: rating,
      }]
    }, () => console.log(this.state));
  }

  showCloseByStations = () => {
    let sortedMarkers = 
      this.state.markers.sort((m1, m2) => {
        let m1Distance = Math.abs(m1.latitude - this.state.currentLocation.latitude) + 
                     Math.abs(m1.longitude - this.state.currentLocation.longitude)
        let m2Distance = Math.abs(m2.latitude - this.state.currentLocation.latitude) + 
                     Math.abs(m2.longitude - this.state.currentLocation.longitude)
        return m1Distance - m2Distance;
      });
    return sortedMarkers.map((marker, index) => {
      if (index < 3) {
        console.log(marker);
        return (<div className="row" style={{display: "flow-root"}}>
                <div className="card" style={{fontSize: ".8rem", marginTop: "0.2rem"}}>
                  <div className="card-body" style={{padding: "0.4rem"}}>
                    <div className="row">
                      <div className="col-10">
                        <h5 className="card-title" style={{fontSize: "1.1rem", marginBottom: "0rem"}}>Air Quality Index: {marker.pollutionIndex} </h5>
                      </div>
                      <div className="col-2">
                        {this.addEmoji(marker.pollutionIndex)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-1">
                        <Icon.GeoAlt style={{marginLeft: "1rem"}}/>
                      </div>
                      <div className="col-9">
                        <p className="card-text" style={{fontSize: "1rem", paddingLeft: "0rem"}}> {marker.address}</p>
                      </div>
                    </div>
                    <p className="card-text" style={{fontSize: "1rem"}}>{marker.info}</p>
                  </div>
                </div>
              </div>)
      }
    });
  }

  render() {
    return ( 
      <div>
        <div className="App-header">
          <div className="row">
            <div className="col-10">
              <p>Air Quality Monitor</p>
            </div>
            <div className="col-2">
              <button type="button" class="btn btn-primary"><FaSatelliteDish/></button>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-start">
            <div className="col-sm-5">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Rate the Air Quality {this.state.currentLocation.airRating}</h5>
                  <div className="row">
                      <div className="col-1">
                        <Icon.GeoAlt style={{marginLeft: "1rem", marginTop: "1rem"}}/>
                      </div>
                      <div className="col-11">
                        <p className="card-text" style={{fontSize: "1rem"}}> {this.state.currentLocation.address}</p>
                      </div>
                    </div>
                    <div style={{display: this.state.currentLocation.airRating != null ? 'none' : 'flex' }}>
                      <ReactStars className="row stars"
                        count={5}
                        readonly = {this.state.currentLocation.airRating}
                        onChange={this.submitRating}
                        size={40}
                        half={true}
                        emptyIcon={<i className="far fa-star"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        color2={"#F0D22C"}
                      />
                    </div>
                </div>
              </div>

              <div className="stations-container">
                {this.showCloseByStations()}
              </div>

              {/* Sensor container */}
              <div className="row">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-10">
                        <h5 className="card-title">Air Quality Index: {this.state.currentLocation.airQality} </h5>
                      </div>
                      <div className="col-2">
                        {this.addEmoji(this.state.currentLocation.airQality)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-1">
                        <Icon.GeoAlt style={{marginLeft: "1rem", marginTop: "1rem"}}/>
                      </div>
                      <div className="col-11">
                        <p className="card-text"> {this.state.currentLocation.address}</p>
                      </div>
                    </div>
                    <p className="card-text">Enjoy your usual outdoors activity.</p>
                    <p className="card-text  text-muted"> 2 days ago </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="col-sm-7">
              <Map className = "Map"
                google = { this.props.google }
                zoom = { 12 }
                // styles = { mapStyle }
                disableDefaultUI = { true }
                legend= { true }
                // Copenhagen
                initialCenter = {
                    {
                        lat: 55.6813442,
                        lng: 12.5837843
                    }
                }
                defaultOptions={{
                  draggable: true, // make map draggable
                  keyboardShortcuts: false, // disable keyboard shortcuts
                  scaleControl: true, // allow scale controle
                  scrollwheel: true, // allow scroll wheel
                }} 
                >
                {this.displayMarkers()}

                <InfoWindow
                  marker={this.state.map.activeMarker}
                  onClose={this.onInfoWindowClose}
                  visible={this.state.map.showingInfoWindow}>
                  <div>

                    <div className="row">
                      <div className="col-8">
                        <h5 className="card-title" style={{fontSize: "0.9rem", marginBottom: "0.5rem"}}>Air Quality Index: {this.state.map.selectedPlace.pollutionIndex} </h5>
                      </div>
                      <div className="col-3">
                        {this.addEmoji(this.state.map.selectedPlace.pollutionIndex)}
                      </div>
                    </div>
                    <div>
                    
                    <p className="card-text" style={{fontSize: "0.75rem", marginBottom: "0.2rem"}}><Icon.GeoAlt/>  {this.state.map.selectedPlace.address}</p>
                    </div>
                    
                    <p className="card-text" style={{fontSize: "0.75rem"}}>{this.state.map.selectedPlace.info}</p>
                  </div>
                </InfoWindow>
                <div className="legend">
                  <div className="row"> 
                    <div className="col" >High</div>
                  </div>
                  <div className="row"> 
                    <div className="col" ><div style={{backgroundColor: "#8B1EE0", marginLeft: "0.5rem"}} className="square"></div></div>
                  </div>
                  <div className="row"> 
                    <div className="col" ><div style={{backgroundColor: "#ED4034", marginLeft: "0.5rem"}} className="square"></div></div>
                  </div>
                  <div className="row"> 
                    <div className="col" ><div style={{backgroundColor: "orange", marginLeft: "0.5rem"}} className="square"></div></div>
                  </div>
                  <div className="row"> 
                    <div className="col" ><div style={{backgroundColor: "BACE28", marginLeft: "0.5rem"}} className="square"></div></div>
                  </div>
                  <div className="row"> 
                    <div className="col" ><div style={{backgroundColor: "#28CE5B", marginLeft: "0.5rem"}} className="square"></div></div>
                  </div>
                  <div className="row"> 
                    <div className="col" >Low</div>
                  </div>
                </div>
              </Map>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBESc_iTGS2Qys0bHcjeChJk9WChsHp4bI'
})(App);