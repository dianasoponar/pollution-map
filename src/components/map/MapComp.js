import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import * as Icon from 'react-bootstrap-icons';
import ReactStars from "react-rating-stars-component";
import './MapComp.css';
import { addEmoji, markersList } from '../utils.js'
import Geocode from "react-geocode";
import firebase from "../../firebase";


export class MapComp extends Component{
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: {
        latitude: null,
        longitude: null,
        address: null,
        airRating: null,
      },
      searchResults: [],
      markers: [],
      map: {
        activeMarker: {},
        showingInfoWindow: false,
        selectedPlace : {
          address: null,
          info: null,
          pollutionIndex: null,
        }
      },
      ratings: [],
      // ratings: [
      //   {
      //     latitude: 55.6743442,
      //     longitude: 12.5935842,
      //     rating: 4,
      //   },
      // ],
      inputValue: "",
    }

    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey("AIzaSyBESc_iTGS2Qys0bHcjeChJk9WChsHp4bI");
    // set response language. Defaults to english.
    Geocode.setLanguage("en");
    
  }

  componentDidMount = () => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const dataSt = await db.collection("pollution-st").get();
      const dataRate = await db.collection("air-rating").get();
      this.setState({
        markers: dataSt.docs.map(doc => (doc.data())),
        ratings: dataRate.docs.map(doc => (doc.data())),
      }, () => console.log(this.state.markers));
      this.getLocation();
    };
  
    fetchData();

  }

  getLocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      position => {
        // Get address from latidude & longitude.
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
          response => {
            this.setState({
              currentLocation: {
                address: response.results[0].formatted_address,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                airRating: this.state.currentLocation.airRating,
              },
              searchResults: this.searchStations(position.coords.latitude, position.coords.longitude),     
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
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/green.png"
      else if (marker.pollutionIndex > 300 && marker.pollutionIndex <= 600)
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/yellow.png"
      else if (marker.pollutionIndex > 600 && marker.pollutionIndex <= 900)
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/orange.png"
      else if (marker.pollutionIndex > 900 && marker.pollutionIndex <= 1200)
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/red.png"
      else if (marker.pollutionIndex > 1200 )
        urlMarker = "http://maps.google.com/mapfiles/ms/icons/purple.png"
      
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

  displayRatings = () => {
    return this.state.ratings.map((rating, index) => {
      return <Marker 
        key={index} 
        id={index} 
        position={{
          lat: rating.latitude,
          lng: rating.longitude
        }}
        icon= {{url: "http://maps.google.com/mapfiles/kml/paddle/ylw-stars_maps.png"}}
        // onClick={this.onMarkerClick}
      />
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
  }

  onInfoWindowClose = () =>{
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
  }

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
  }

  submitRating = (rating) => {
    this.setState({
      currentLocation: {
        address: this.state.currentLocation.address,
        latitude: this.state.currentLocation.latitude,
        longitude: this.state.currentLocation.longitude,
        airRating: rating,
      },
      ratings: [...this.state.ratings, {
        latitude: this.state.currentLocation.latitude,
        longitude: this.state.currentLocation.longitude,
        rating: rating,
      }],
    }, () => {
      console.log(this.state);
      this.displayRatings();
    });

    const db = firebase.firestore();
    db.collection("air-rating").add({ 
      latitude: this.state.currentLocation.latitude,
      longitude: this.state.currentLocation.longitude,
      rating: rating, 
    });
  }

  searchStations = (latitude, longitude) => {
    let sortedMarkers = 
      this.state.markers.sort((m1, m2) => {
        let m1Distance = Math.abs(m1.latitude - latitude) + 
                     Math.abs(m1.longitude - longitude)
        let m2Distance = Math.abs(m2.latitude - latitude) + 
                     Math.abs(m2.longitude - longitude)
        return m1Distance - m2Distance;
      });
    
    return sortedMarkers.slice(0, 3);
  }

  handleSearch (event) {
    this.setState({ inputValue: event.target.value })
  }

  handleGoClick (event) {
    event.preventDefault();
    Geocode.fromAddress(this.state.inputValue).then(
      response => {
        // this.setState({
        //   currentLocation: {
        //     airQality: this.state.currentLocation.airQality,
        //     address: response.results[0].formatted_address,
        //     latitude: position.coords.latitude,
        //     longitude: position.coords.longitude,
        //     airRating: this.state.currentLocation.airRating,
        //   },
        //   searchResults: this.searchStations(position.coords.latitude, position.coords.longitude),     
        // }, () => console.log(this.state.currentLocation.address));
        console.log(response);
        let stations = this.searchStations(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng);
        this.setState({
          searchResults: stations,
        }, () => console.log(this.state));
      },
      error => {
        console.error(error);
      }
    );
  }

  render() {
    return ( 
      <div>
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
                    <div style={{display: this.state.currentLocation.airRating != null ? 'none' : 'flex', marginLeft: "1.3rem" }}>
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

              {/* Search*/}
              <form className="search-container" onSubmit={this.handleGoClick.bind(this)}>
                <button className="btn btn-light button-search"  type="submit" value="Submit"> <Icon.Search/> </button>
                <input 
                  className="form-control form-control-sm ml-3 w-75" 
                  value={this.state.inputValue} 
                  onChange={this.handleSearch.bind(this)} 
                  placeholder="Search Air Pollution Stations"/>
              </form>

              <div className="stations-container">
                {this.state.searchResults.map((item) => {
                  return (<div className="row" style={{display: "flow-root"}}>
                    <div className="card" style={{fontSize: ".8rem", marginTop: "0.2rem"}}>
                      <div className="card-body" style={{padding: "0.4rem"}}>
                        <div className="row">
                          <div className="col-10">
                            <h5 className="card-title" style={{fontSize: "1.1rem", marginBottom: "0rem"}}>Air Quality Index: {item.pollutionIndex} </h5>
                          </div>
                          <div className="col-2">
                            {addEmoji(item.pollutionIndex)}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-1">
                            <Icon.GeoAlt style={{marginLeft: "1rem"}}/>
                          </div>
                          <div className="col-9">
                            <p className="card-text" style={{fontSize: "1rem", paddingLeft: "0rem"}}> {item.address}</p>
                          </div>
                        </div>
                        <p className="card-text" style={{fontSize: "1rem"}}>{item.info}</p>
                      </div>
                    </div>
                  </div>)
                })}
              </div>
            </div>

            {/* Map */}
            <div className="col-sm-7">
              <Map className = "Map"
                google = { this.props.google }
                zoom = { 12 }
                // styles = { mapStyle }
                disableDefaultUI = { true }
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
                {this.displayRatings()}

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
                        {addEmoji(this.state.map.selectedPlace.pollutionIndex)}
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
                    <div className="col" ><div style={{backgroundColor: "yellow", marginLeft: "0.5rem"}} className="square"></div></div>
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
})(MapComp);