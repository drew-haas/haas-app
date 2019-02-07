import React, { Component } from 'react';
import {TweenMax, TimelineMax, Expo } from "gsap/all";

class Header extends Component {
  constructor(props) {
    super(props);

    // state properties
    this.state = {
      navigationOpen: false
    };
    
    // menu nav items
    this.menuTl = new TimelineMax({ paused: true });
    this.menuBar = null;

    // menu nav functions
    this.toggleNavigation = this.toggleNavigation.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.openNav = this.openNav.bind(this);
  }

  openNav() {
    document.querySelector('.menu').classList.add('open');
    this.setState({ navigationOpen: true });
    this.menuTl.play();
  }

  closeNav() {
    document.querySelector('.menu').classList.remove('open');
    this.setState({ navigationOpen: false });
    this.menuTl.reverse();
  }

  toggleNavigation() {
    if (this.state.navigationOpen) {
      this.closeNav();
    } else {
      this.openNav();
    }
  }

  componentDidMount(){
    this.menuTl.to(document.querySelector('.menu_bar'), .5, {width: '100%', ease: Expo.easeInOut})
               .to(document.querySelector('.menu_bar'), .5, {height: '100vh', ease: Expo.easeInOut}, '-=.1')
               .staggerTo(document.querySelectorAll('.menu_link_container'), .8, {y: 0, opacity: 1, ease: Expo.easeOut}, .1, '-=.4');
  }

  render() {
    return (
      <div className="header_container">
        <header>
          <div className="logo"><div className="logo-text">Dh</div></div>
          <div className="menu">
            <div className="menu_container">
              <div className="menu_bar"></div>
              <div className="menu_content">
                <ul>
                  <li><span className="menu_link_container">Work</span></li>
                  <li><span className="menu_link_container life">Life</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="menu_icon" onClick={this.toggleNavigation}>
            <div className="line_container">
              <div className="line line_1"></div>
              <div className="line line_2"></div>
            </div>
          </div>
        </header>
      </div>
    )
  }
}

export default Header;