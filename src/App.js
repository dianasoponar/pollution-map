import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import MapComp from './components/map/MapComp';
import PollutionStation from './components/station/PollutionStation';
import { FaSatelliteDish } from "react-icons/fa";

export class App extends Component{
  
  render() {
    return ( 
      <div>
        <Router>
          <div className="App-header">
            <div className="row" style={{width: "100%"}}>
              <div className="col-11">
                <p style={{marginBottom: "0rem"}}>Air Quality Monitor</p>
              </div>
              <div className="col-1">
                <Link to="/pollution-station">
                  <button type="button" className="btn btn-dark" style={{padding: "0.1rem 0.6rem 0.4rem 0.7rem"}}><FaSatelliteDish/></button>
                </Link>
              </div>
            </div>
          </div>
          <Route path="/" exact component={MapComp} />
          <Route path="/pollution-station" component={PollutionStation} />
        </Router>
      </div>
      
    );
  }
}

export default App