import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Table from './Table.js'

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
      <div className="jumbotron">
        <h1 className="display-4">Promo finder</h1>
        <p className="lead">Promo finder from lafourchette.com</p>
        <button type="button" class="btn btn-primary btn-lg">Large button</button>
        <hr className="my-4"/>
        <h2 className="display-4">PROMO :</h2>
        <Table restaurants = {this.state.restaurants}/>
      </div>
        );
  }
}

export default App;
