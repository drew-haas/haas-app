import React, { Component } from 'react';
import { TweenMax, Expo, Power1, Elastic } from 'gsap/all';

// Caching some stuff..
const body = document.body;
const docEl = document.documentElement;
const projects = [
    {
        title: 'Design Central',
        classSuffix: 'design-central',
        subTitle: 'An Interactive website for a product design and engineering company. Created with Drupal and custom Javascript animations and solutions.',
        titleImage: require('../assets/images/work-design-central.jpg'),
        images: [],
        type: 'work',
        tags: ['animation', 'front-end', 'web'],
        link: 'https://www.designcentral.com/'
    },
    {
        title: 'The Laughing Cow',
        classSuffix: 'laughing-cow',
        subTitle: 'New and Old techniques used on this playful website for this well known dairy company.',
        titleImage: require('../assets/images/work-laughing-cow.jpg'),
        images: [],
        type: 'work',
        tags: ['animation', 'front-end', 'web'],
        link: 'https://www.thelaughingcow.com/'
    },
    {
        title: 'Tahoe',
        classSuffix: 'Tahoe',
        subTitle: 'Climbing mountains and riding down them. South Lake Tahoe, CA.',
        titleImage: require('../assets/images/life-tahoe.jpg'),
        images: [],
        type: 'life',
        tags: ['photography', 'adventure', 'travels'],
        link: 'https://www.instagram.com/p/BmLlaDSgp6d/'
    },
    {
        title: 'San Francisco',
        classSuffix: 'san-francisco',
        subTitle: 'The city where everything just kind of worked out. My new home.',
        titleImage: require('../assets/images/life-sf.jpg'),
        images: [],
        type: 'life',
        tags: ['photography', 'adventure', 'travels'],
        link: 'https://www.instagram.com/p/BmLlaDSgp6d/'
    }
];

// Gets the mouse position. From http://www.quirksmode.org/js/events_properties.html#position
const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) 	{
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) 	{
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return { x : posx, y : posy }
};

class Hero extends Component {
    constructor(props) {
        super(props);
        // parallax 'tilt' configuration
        this.tilt = {};
        this.tiltconfig = {   
            title: {translation : {x: [-8,8], y: [4,-4]}},
            number: {translation : {x: [-5,5], y: [-10,10]}},
            img: {translation : {x: [-15,15], y: [-10,10]}}
        };

        this.toggleHoverAnimation = this.toggleHoverAnimation.bind(this);
        this.parallaxItem = this.parallaxItem.bind(this);
        this.resetTilt = this.resetTilt.bind(this);
    }

    resetTilt() {
        for (let key in this.tilt ) {
            TweenMax.to(this.tilt[key], 2, {
                ease: Expo.easeOut,
                x: 0,
                y: 0
            });
        }
    }

    toggleHoverAnimation(el, type, ev) {
        let gridItem = document.querySelector('.grid_item-' + el);
        let gridItemTitle = gridItem.querySelector('.grid_item-title');
        let gridItemBG = gridItem.querySelector('.grid_item-bg');
        let gridItemNumbers = gridItem.querySelectorAll('.number');

        // animate title
        TweenMax.to(gridItemTitle, 1, {scale: type === 'mouseenter' ? 1.15 : 1, ease: Expo.easeOut});
        
        // animate background
        TweenMax.to(gridItemBG, 1, {scale: type === 'mouseenter' ? 1.15 : 1, ease: Expo.easeOut});
        
        // Animate the number letters.
        gridItemNumbers.forEach((letter,pos) => {
            TweenMax.to(letter, .2, {
                ease: Power1.easeIn,
                delay: pos * .1,
                y: type === 'mouseenter' ? '-50%' : '50%',
                opacity: 0,
                onComplete: () => {
                    TweenMax.to(letter, type === 'mouseenter' ? 0.6 : 1, {
                        ease: type === 'mouseenter' ? Expo.easeOut : Elastic.easeOut.config(1,0.4),
                        startAt: {y: type === 'mouseenter' ? '70%' : '-70%', opacity: 0},
                        y: '0%',
                        opacity: 1
                    });
                }
            });
        });

        if (type === 'mouseleave'){
            this.resetTilt();
        }
    }

    // parallax motion on 
    parallaxItem(el, type, ev) {
        let gridItem = document.querySelector('.grid_item-' + el);

        this.tilt.img = gridItem.querySelector('.grid_item-img');
        this.tilt.title = gridItem.querySelector('.grid_item-title');
        this.tilt.number = gridItem.querySelector('.grid_item-number');

        // Get mouse position.
        const mousepos = getMousePos(ev);
        // Document scrolls.
        
        const docScrolls = {left : body.scrollLeft + docEl.scrollLeft, top : body.scrollTop + docEl.scrollTop};
        const bounds = gridItem.getBoundingClientRect();
        // Mouse position relative to the main element (this.DOM.el).
        const relmousepos = {
            x : mousepos.x - bounds.left - docScrolls.left, 
            y : mousepos.y - bounds.top - docScrolls.top 
        };

        // Movement settings for the tilt elements.
        for (let key in this.tilt) {
            let t = this.tiltconfig[key].translation;
            // Animate each of the elements..
            TweenMax.to(this.tilt[key], 2, {
                ease: Expo.easeOut,
                x: (t.x[1]-t.x[0])/bounds.width*relmousepos.x + t.x[0],
                y: (t.y[1]-t.y[0])/bounds.height*relmousepos.y + t.y[0]
            });
        }
    }

    // Clear filters on page
    clearFilters() {
        // display only the filtered options in the grid
        var gridItems = document.querySelectorAll('.grid_row');

        // show filtered by
        for (var j = 0; j < gridItems.length; j++){
            gridItems[j].classList.remove('hidden');
        }

        // hide clear option
        document.querySelector('.clear_button').classList.add('hidden');

        document.documentElement.scrollTop = 0;
    }

    render() {
        const gridItems = projects.map((proj, index) => 
            <div className={'grid_row grid_row-' + proj.classSuffix + ' grid_type-' + proj.type} key={index}>
                <div 
                className={'grid_item grid_item-' + proj.type + ' grid_item-' + proj.classSuffix} 
                onMouseEnter={this.toggleHoverAnimation.bind(this, proj.classSuffix, 'mouseenter')} 
                onMouseLeave={this.toggleHoverAnimation.bind(this, proj.classSuffix, 'mouseleave')}
                onMouseMove={this.parallaxItem.bind(this, proj.classSuffix, 'mousemove')}>
                    <div className="grid_item-bg"></div>
                    <div className="grid_item-title">{proj.title}</div>
                    <div className="grid_item-img-wrap">
                        <div className="grid_item-img" style={{backgroundImage: `url(${ proj.titleImage })`}}></div>
                    </div>
                    <div className="grid_item-number"><span className="number">0</span><span className="number">{index + 1}</span></div>
                </div>
            </div>
        );
        return (
            <div className="heroSection">
                <div className="bgtext">DrewHaas</div>
                <div className="grid_container">{gridItems}</div>
                <div className="clear_button hidden" onClick={this.clearFilters}>Clear</div>
            </div>
        );
    }
}

export default Hero;