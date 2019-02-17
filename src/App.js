import React, { Component } from 'react';
//import logo from './logo.svg';
import Header from './components/Header';
import Hero from './components/Hero';
import './assets/styles/Main.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Hero/>
      </div>
    );
  }
}

export default App;
