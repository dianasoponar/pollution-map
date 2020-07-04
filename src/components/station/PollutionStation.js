import React, { Component } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { addEmoji } from '../utils.js'
import Geocode from "react-geocode";
import './PollutionStation.css'


export class PollutionStation extends Component{
    constructor(props) {
        super(props)
        this.state = {
            currentLocation: {
                latitude: null,
                longitude: null,
                address: null,
                airQality: null,
            }
        } 

        // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
        Geocode.setApiKey("AIzaSyBESc_iTGS2Qys0bHcjeChJk9WChsHp4bI");
        // set response language. Defaults to english.
        Geocode.setLanguage("en");
    }

    componentDidMount = async () => {
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
                    airQality: this.state.currentLocation.airQality,
                  }
                }, () => console.log(this.state));
              },
              error => {
                console.error(error);
              }
            );
          }, 
          err => console.log(err)
        );

        this.getPollution();
      }    

    getPollution = () => {
        fetch("https://api.thingspeak.com/channels/475700/feeds.json?results=1")
          .then(res => res.json())
          .then(
            (result) => {
                this.setState({
                    currentLocation: {
                        address: this.state.currentLocation.address,
                        latitude: this.state.currentLocation.latitude,
                        longitude: this.state.currentLocation.longitude,
                        airQality: result["feeds"][0]["field1"],
                    }
                  }, () => console.log(this.state.currentLocation.airQality));
            },
            (error) => {
              console.error(error);
            }
          )
      }

    render() {
        return (
            <div>
                <Link to="/" >
                    <button className="btn btn-outline-dark back-button">
                        <Icon.ArrowLeft size="1.5rem"/>
                    </button>
                </Link>
                <div className="sensor-container">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                            <div className="col-10">
                                <h5 className="card-title">Air Quality Index: {this.state.currentLocation.airQality} </h5>
                            </div>
                            <div className="col-2">
                                {addEmoji(this.state.currentLocation.airQality)}
                            </div>
                            </div>
                            <div className="row" style={{paddingLeft: "1rem"}}>
                            <div className="col-1">
                                <Icon.GeoAlt/>
                            </div>
                            <div className="col-11">
                                <p className="card-text" style={{paddingLeft: "0rem"}}> {this.state.currentLocation.address}</p>
                            </div>
                            </div>
                            <p className="card-text">Enjoy your usual outdoors activity.</p>
                            <p className="card-text  text-muted"> 2 days ago </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PollutionStation