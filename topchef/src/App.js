import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { progressBarFetch, setOriginalFetch } from 'react-fetch-progressbar';
import { ProgressBar } from 'react-fetch-progressbar';
import Table from './Table.js'

setOriginalFetch(window.fetch);
window.fetch = progressBarFetch;
class App extends Component {
  constructor(){
    super();
    this.state = { restaurants : []}
  }

  componentDidMount(){
    fetch('/api/restaurants')
    .then(resul => resul.json())
    .then(json => {
      this.setState({restaurants : json})
      console.log(this.state.restaurants)  
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
      <ProgressBar/>
      <div className="jumbotron">
        <h1 className="display-4">Promo finder</h1>
        <p className="lead">Promo finder from lafourchette.com</p>
        <hr className="my-4"/>
        <h2 className="display-4">PROMO :</h2>
        <Table restaurants = {this.state.restaurants}/>
      </div>
      </div>
        );
  }
}

export default App;
