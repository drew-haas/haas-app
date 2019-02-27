import React, { Component } from 'react';
import ScrollImage from '../components/ScrollImage';
import { TweenMax, Expo, Power1, Elastic, Back } from 'gsap/all';

// Caching some stuff..
const body = document.body;
const docEl = document.documentElement;
// all grid items
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
// Calculates the offsetTop or offsetLeft of an element relative to the viewport 
// (not counting with any transforms the element might have)
const getOffset = (elem, axis) => {
    let offset = 0;
    const type = axis === 'top' ? 'offsetTop' : 'offsetLeft';
    do {
        if ( !isNaN( elem[type] ) )
        {
            offset += elem[type];
        }
    } while( elem = elem.offsetParent );
    return offset;
}
const distance = (p1,p2) => Math.hypot(p2.x-p1.x, p2.y-p1.y);
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
// Window sizes.
let winsize;
const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
calcWinsize();
window.addEventListener('resize', calcWinsize);

// Scroll control functions. Taken from https://stackoverflow.com/a/4770179.
const keys = {37: 1, 38: 1, 39: 1, 40: 1};
const preventDefault = (e) => {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;  
}
const preventDefaultForScrollKeys = (e) => {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
const disableScroll = () => {
    if (window.addEventListener) // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}
const enableScroll = () => {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

// The Content class. Represents one content item per grid item.
class Content {
    constructor(el) {
        this.DOM = {el: el};
        // The content elements: image, title, subtitle and text.
        this.DOM.img = this.DOM.el.querySelector('.content_item-img');
        this.DOM.title = this.DOM.el.querySelector('.content_item-title');
        this.DOM.subtitle = this.DOM.el.querySelector('.content_item-subtitle');
        this.DOM.text = this.DOM.el.querySelector('.content_item-text');
    }
    /**
     * Show/Hide the content elements (title letters, the subtitle and the text).
     */
    show(delay = 0, withAnimation = true) { this.toggle(delay, withAnimation); }
    hide(delay = 0, withAnimation = true) { this.toggle(delay, withAnimation, false); }
    toggle(delay, withAnimation, show = true) {
        setTimeout(() => {
            
            this.DOM.titleLetters.forEach((letter,pos) => {
                TweenMax.to(letter, !withAnimation ? 0 : show ? .6 : .3, {
                    ease: show ? Back.easeOut : Power1.easeIn,
                    delay: !withAnimation ? 0 : show ? pos*.05 : (this.titleLettersTotal-pos-1)*.04,
                    startAt: show ? {y: '50%', opacity: 0} : null,
                    y: show ? '0%' : '50%',
                    opacity: show ? 1 : 0
                });
            });
            this.DOM.subtitle.style.opacity = show ? 1 : 0;
            this.DOM.text.style.opacity = show ? 1 : 0;

        }, withAnimation ? delay*1000 : 0 );
    }
}

class Hero extends Component {
    constructor(props) {
        super(props);
        
        // parallax 'tilt' configuration
        this.allowtilt = true;
        this.tilt = {};
        this.tiltconfig = {   
            title: {translation : {x: [-8,8], y: [4,-4]}},
            number: {translation : {x: [-5,5], y: [-10,10]}},
            img: {translation : {x: [-30,30], y: [-20,20]}}
        };
        // node reference of all grid items
        this.gridItems = {};

        // The content items.
        this.contents = [];

        // hover animation
        this.toggleHoverAnimation = this.toggleHoverAnimation.bind(this);
        this.parallaxItem = this.parallaxItem.bind(this);
        this.resetTilt = this.resetTilt.bind(this);
    }


    /* 
    *
    * Utitlity functions
    *
    */
    // Based on https://stackoverflow.com/q/25481717
    sortByDist(refPoint, itemsArray) {
        let distancePairs = [];
        let output = [];

        for(let i in itemsArray) {
            const rect = itemsArray[i].getBoundingClientRect();
            distancePairs.push([distance(refPoint,{x:rect.left+rect.width/2, y:rect.top+rect.height/2}), i]);
        }

        distancePairs.sort((a,b) => a[0]-b[0]);

        for(let p in distancePairs) {
            const pair = distancePairs[p];
            output.push(itemsArray[pair[1]]);
        }

        return output;
    }
    // get size and position of element
    getSizePosition(el, scrolls = true) {
        const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        return {
            width: el.offsetWidth,
            height: el.offsetHeight,
            left: scrolls ? getOffset(el, 'left')-scrollLeft : getOffset(el, 'left'),
            top: scrolls ? getOffset(el, 'top')-scrollTop : getOffset(el, 'top')
        };
    }
    // reset the parallax/tilt of the hover
    resetTilt() {
        for (let key in this.tilt ) {
            TweenMax.to(this.tilt[key], 2, {
                ease: Expo.easeOut,
                x: 0,
                y: 0
            });
        }
    }
    // clear the work/life filters on page
    clearFilters() {
        // display only the filtered options in the grid
        var gridItems = document.querySelectorAll('.grid_row');
        // show filtered by
        for (var j = 0; j < gridItems.length; j++){
            gridItems[j].classList.remove('hidden');
        }
        // hide clear option
        document.querySelector('.clear_button').classList.add('hidden');
        // set scroll position back to top of page
        document.documentElement.scrollTop = 0;
    }
    closeDetails() {
        
    }


    // On hover animations
    toggleHoverAnimation(el, type, ev) {
        if (!this.allowtilt) return;

        // reusable vars
        let gridItem = document.querySelector('.grid_item-' + el);
        let gridItemTitle = gridItem.querySelector('.grid_item-title');
        let gridItemBG = gridItem.querySelector('.grid_item-bg');
        let gridItemNumbers = gridItem.querySelectorAll('.number');

        // animate title
        TweenMax.to(gridItemTitle, 1, {scale: type === 'mouseenter' ? 1.15 : 1, ease: Expo.easeOut});
        
        // animate background
        TweenMax.to(gridItemBG, 1, {scale: type === 'mouseenter' ? 1.1 : 1, ease: Expo.easeOut});
        
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

    // parallax motion on hover
    parallaxItem(el, type, ev) {
        if (!this.allowtilt) return;

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

    
    /*
     * 
     * Shows/Hides all the grid items except the "exclude" item.
     * The items will be sorted based on the distance to the exclude item.
     * 
     */
    showAllItems(exclude, withAnimation = true) { this.toggleAllItems(exclude, withAnimation); }
    hideAllItems(exclude, withAnimation = true) { this.toggleAllItems(exclude, withAnimation, false); }
    toggleAllItems(exclude, withAnimation, show = true) {
        if ( !withAnimation ) {
            this.gridItems.filter(item => item !== exclude).forEach((item, pos) => item[show ? 'show' : 'hide'](withAnimation));
        }
        else {
            const refrect = exclude.getBoundingClientRect(); 
            const refPoint = {
                x: refrect.left+refrect.width/2, 
                y: refrect.top+refrect.height/2
            };
            let itemsArray = Array.from(this.gridItems);
            let staggerDelay = 0;
            this.sortByDist(refPoint, itemsArray.filter(item => item !== exclude)).forEach(function(item) {
                setTimeout(function() {
                    let itemBg = item.querySelector('.grid_item-bg');
                    let itemImg = item.querySelector('.grid_item-img');
                    let itemTitle = item.querySelector('.grid_item-title');
                    let itemNumbers = item.querySelector('.grid_item-number');
                    TweenMax.to(itemBg, .5, {scale: .5, opacity: 0, delay: .2, ease: Expo.easeInOut});
                    TweenMax.to(itemImg, .5, {scale: .5, opacity: 0, ease: Expo.easeInOut});
                    TweenMax.to(itemTitle, .5, {y: '15px', opacity: 0, delay: .1, ease: Expo.easeInOut});
                    TweenMax.to(itemNumbers, .5, {y: '15px', opacity: 0, delay: .1, ease: Expo.easeInOut});
                }, staggerDelay);
                staggerDelay += 200;
            });
        }
    }


    // Open the grid item
    openItem(item) {
        if ( this.isAnimating ) return;
        
        this.allowtilt = false;
        this.isAnimating = true;
        
        // set up reusable vars
        let itemBg = item.querySelector('.grid_item-bg');
        let itemTitle = item.querySelector('.grid_item-title');
        let itemNumber = item.querySelector('.grid_item-number');
        let itemImg = item.querySelector('.grid_item-img');
        let contentEl = document.querySelector('.content_item-' + item.dataset.project );
        let contentElImg = contentEl.querySelector('.content_item-img');

        // Get the current scroll position.
        this.scrollPos = window.scrollY;

        // Disable page scrolling.
        disableScroll();

        // Hide all the grid items except the one we want to open.
        this.hideAllItems(item);

        // hide text of current item
        TweenMax.to(itemTitle, .4, {y: '20px', delay: .2, opacity: 0, ease: Expo.easeInOut});
        TweenMax.to(itemNumber, .4, {y: '20px', delay: .2, opacity: 0, ease: Expo.easeInOut});
        
        // Get the "grid_item-bg" width and height and set it explicitly,
        // also set its top and left respective to the page.
        const itemDim = this.getSizePosition(item);
        // Set it to position fixed.
        itemBg.style.position = 'fixed';
        // Calculate the viewport diagonal. We will need to take this in consideration when scaling up the item´s bg element.
        const d = Math.hypot(winsize.width, winsize.height);
        // Scale up the item´s bg element.
        TweenMax.to(itemBg, 1.2, {
            ease: Expo.easeInOut,
            delay: 0.2,
            backgroundColor: '#e8e8e8',
            //x: winsize.width/2 - (itemDim.left+itemDim.width/2),
            y: winsize.height/2 - (itemDim.top+itemDim.height/2),
            scaleX: d/itemDim.width,
            scaleY: d/itemDim.height,
            rotation: -1*item.angle*2
        });

        // get the content element
        // Set the current value (index of the clicked item).
        // this.current = this.gridItems.indexOf(item);
        // const contentEl = this.contents[this.current];

        //TODO: make sure image and BG are always animating to correct positions
        const imgDim = this.getSizePosition(itemImg);
        const contentImgDim = this.getSizePosition(contentElImg, false);

        TweenMax.to(itemImg, 1.2, {
            ease: Expo.easeInOut,
            delay: 0.55,
            // scaleX: contentImgDim.width/imgDim.width,
            // scaleY: contentImgDim.height/imgDim.height,
            //x: (contentImgDim.left+contentImgDim.width/2)-(imgDim.left+imgDim.width/2),
            //y: (contentImgDim.top+contentImgDim.height/2)-(imgDim.top+imgDim.height/2),
            rotation: 0,
            onComplete: () => {
                // Hide the item´s image and show the content´s image. Should both be overlapping.
                itemImg.classList.add('hidden');
                
                // show the content item
                contentEl.classList.add('current');

                // show the close button
                document.querySelector('.close_button').classList.remove('hidden');
                
                // Hiding the grid scroll.
                document.querySelector('.grid_container').classList.add('hidden');

                // Scroll up the page.
                window.scrollTo(0, 0);
                
                // Enable page scrolling.
                enableScroll();
            }
        });
    }
    
    // run on mount
    componentDidMount(){
        // create node ref list/array of grid items
        this.gridItems = Array.from(document.querySelectorAll('.grid_item'));
        for (let item of this.gridItems) {
            item.addEventListener('click', (ev) => {
                ev.preventDefault();
                this.openItem(item);
            });
        }

        Array.from(document.querySelectorAll('.content_item')).forEach(contentEl => this.contents.push(new Content(contentEl)));
    }

    // render all html
    render() {
        // generate grid Items/Projects based on array
        const gridItems = projects.map((proj, index) => 
            <div className={'grid_row grid_row-' + proj.classSuffix + ' grid_type-' + proj.type} key={index} data-project={proj.classSuffix}>
                <div 
                className={'grid_item grid_item-' + proj.type + ' grid_item-' + proj.classSuffix} 
                onMouseEnter={this.toggleHoverAnimation.bind(this, proj.classSuffix, 'mouseenter')} 
                onMouseLeave={this.toggleHoverAnimation.bind(this, proj.classSuffix, 'mouseleave')}
                onMouseMove={this.parallaxItem.bind(this, proj.classSuffix, 'mousemove')}
                data-project={proj.classSuffix}>
                    <div className="grid_item-bg"></div>
                    <div className="grid_item-title">{proj.title}</div>
                    <div className="grid_item-img-wrap">
                        <div className="grid_item-img" style={{backgroundImage: `url(${ proj.titleImage })`}}></div>
                    </div>
                    <div className="grid_item-number"><span className="number">0</span><span className="number">{index + 1}</span></div>
                </div>
            </div>
        );
        const contentItmes = projects.map((proj, index) => 
            <div className={'content_item content_item-' + proj.classSuffix} key={index}>
                <div className={'content_item-img-grid'}>
                    <div className={'content_item-img'} style={{backgroundImage: `url(${ proj.titleImage })`}}></div>
                </div>
                <div className={'content_item-title'}>{proj.title}</div>
                <div className={'content_item-subtitle'}>{proj.subTitle}</div>
            </div>
        );
        return (
            <div className="heroSection">
                <div className="bgtext">DrewHaas</div>
                <div className="hero-text-container">
                    <h2>Welcome to this facet of my digital presence. Where you can see what I've done at work and in life.</h2>
                    <h3>Front End Developer</h3>
                </div>
                <ScrollImage></ScrollImage>
                <div className="grid_container">{gridItems}</div>
                <div className={'content_container'}>
                    {contentItmes}
                    <div className="close_button hidden" onClick={this.closeDetails}>Close</div>
                </div>
                <div className="clear_button hidden" onClick={this.clearFilters}>Clear</div>
            </div>
        );
    }
}

export default Hero;