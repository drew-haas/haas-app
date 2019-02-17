import React, { Component } from 'react';
import {TweenMax, TimelineMax, Expo } from "gsap/all";

class Header extends Component {
  constructor(props) {
    super(props);

    // state properties
    this.state = {
      navigationOpen: false,
      filteredBy: 'all'
    };
    
    // menu nav items
    this.menuTl = new TimelineMax({ paused: true });
    this.menuBar = null;

    // menu nav functions
    this.toggleNavigation = this.toggleNavigation.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.openNav = this.openNav.bind(this);
    this.filterPage = this.filterPage.bind(this);
  }

  openNav() {
    document.querySelector('.menu').classList.add('open');
    document.querySelector('.menu_icon').classList.add('open');
    this.setState({ navigationOpen: true });
    this.menuTl.play();
  }

  closeNav() {
    document.querySelector('.menu').classList.remove('open');
    document.querySelector('.menu_icon').classList.remove('open');
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

  filterPage(filter) {
    // display only the filtered options in the grid
    var gridItems = document.querySelectorAll('.grid_row');
    var filteredItems = document.querySelectorAll('.grid_type-' + filter);

    // hide all
    for (var i = 0; i < gridItems.length; i++){
      gridItems[i].classList.add('hidden');
    }

    // show filtered by
    for (var j = 0; j < filteredItems.length; j++){
      filteredItems[j].classList.remove('hidden');
    }

    // show clear option
    document.querySelector('.clear_button').classList.remove('hidden');

    // set scroll position to top of page
    document.documentElement.scrollTop = 0;

    // Then Close Nav
    this.closeNav();
  }

  // component ready...
  componentDidMount(){
    this.menuTl.to(document.querySelector('.menu_bar'), .5, {width: '100%', ease: Expo.easeInOut})
               .to(document.querySelector('.menu_bar'), .5, {height: '100vh', ease: Expo.easeInOut}, '-=.1')
               .staggerTo(document.querySelectorAll('.menu_link_container'), .5, {y: 0, opacity: 1, ease: Expo.easeOut}, .1, '-=.4');

    window.addEventListener("resize", function() {
      TweenMax.set(document.querySelector('.menu_bar'), {width: '60px'});
      // TODO: make sure the nav bar doesn't use a percent on close
      // --- this makes the nav change size when closed
    });
  }

  render() {
    return (
      <div className="header_container">
        <header>
          <a href="/"><div className="logo"><div className="logo-text"></div></div></a>
          <div className="menu">
            <div className="menu_container">
              <div className="menu_bar"></div>
              <div className="menu_content">
                <ul>
                  <li className="menu_link"><span className="menu_link_container" onClick={() => this.filterPage('work')}>Work</span></li>
                  <li className="menu_link"><span className="menu_link_container life" onClick={() => this.filterPage('life')}>Life</span></li>
                  <li className="menu_text"><span className="menu_link_container"><code>andrewfhaas@gmail.com</code></span></li>
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