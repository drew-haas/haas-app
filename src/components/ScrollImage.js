import React, { Component } from 'react';
import { TweenMax, Expo} from 'gsap/all';

let rotationEl;

class ScrollImage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        rotationEl = document.querySelector('.scroll-img-container');
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    
    handleScroll(event) {
        let scrollTop = event.target.scrollingElement.scrollTop,
            itemRotation = scrollTop * .14,
            opacity = 1 - (itemRotation / 100);
        
        TweenMax.to(rotationEl, 2, {x: itemRotation * 1.5 + 'px', opacity: opacity, rotation: itemRotation, ease: Expo.easeOut});
    }

    scrollWatch() {

    }

    render() {
        return (
            <div className="scroll-img-container">
                <img src={require('../assets/images/img-drew-flying.png')} alt="Drew Flying"/>
            </div>
        );
    }
}

export default ScrollImage;