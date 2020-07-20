import React, { Component } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { addEmoji } from '../utils.js'
import Geocode from "react-geocode";
import './PollutionStation.css'
import { GeocodeApiKey, WeatherApiKey } from '../apiKeys.js'


export class PollutionStation extends Component{
    constructor(props) {
        super(props)
        this.state = {
            currentLocation: {
                latitude: null,
                longitude: null,
                address: null,
                airQality: null,
            },
            weather: {
                temperature: null,
                description: null,
                image: null,
                feelslike: null,
                humidity: null,
                windspeed: null,
                location: null,
            },
        } 

        // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
        Geocode.setApiKey(GeocodeApiKey);
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
                }, () => {
                    console.log(this.state);
                    this.getWeather();
                });
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
                    },
                    weather: this.state.currentLocation,
                  }, () => console.log(this.state.currentLocation.airQality));
            },
            (error) => {
              console.error(error);
            }
        )
    }

    getWeather = () => {
        const weatherURL = 
            "https://api.openweathermap.org/data/2.5/weather?lat=" + this.state.currentLocation.latitude + "&lon=" + 
            this.state.currentLocation.longitude + "&appid=" + WeatherApiKey + "&units=metric";
        fetch(weatherURL)
          .then(res => res.json())
          .then(
            (result) => {
                console.log(result);
                this.setState({
                    currentLocation: this.state.currentLocation,
                    weather: {
                        temperature: result.main.temp,
                        description: result.weather[0].description,
                        image: "http://openweathermap.org/img/w/" + result.weather[0].icon + ".png",
                        feelslike: result.main.feels_like,
                        humidity: result.main.humidity,
                        windspeed: result.wind.speed,
                        location: result.name,
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

                <div className="row pollution-container justify-content-center">
                    <div className="sensor-container col-sm-5">
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

                    <div className="col-sm-5" style={{display: "contents"}}>
                        <div className="card" style={{alignItems: "center", display: "flow-root"}}>
                            <p className="card-text">{this.state.weather.location}</p>
                            <div className="row" style={{flexWrap: "nowrap"}}>
                                <img className="weather-icon col-sm-2" style={{maxWidth: "fit-content"}} src={this.state.weather.image}/>
                                <h2 className="col-sm-8">{Math.round(this.state.weather.temperature)} °C</h2>
                            </div>
                            <p className="card-text">{this.state.weather.description}</p>

                            <div className="card-body">
                                <div className="row">
                                    <p className="text-muted col-sm-7" style={{marginBottom: "0px"}}>Feels like</p>
                                    <p className="text-muted col-sm" style={{marginBottom: "0px"}}>{this.state.weather.feelslike}°C</p>
                                </div>
                                <div className="row">
                                    <p className="text-muted col-sm-7" style={{marginBottom: "0px"}}>Humidity</p>
                                    <p className="text-muted col-sm" style={{marginBottom: "0px"}}>{this.state.weather.humidity}%</p>
                                </div>
                                <div className="row">
                                    <p className="text-muted col-sm-7">Wind speed</p>
                                    <p className="text-muted col-sm">{this.state.weather.windspeed}m/s</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PollutionStation