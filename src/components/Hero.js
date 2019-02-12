import React, { Component } from 'react';

const projects = [
    {
        title: 'Design Central',
        classSuffix: 'design-central',
        subTitle: 'An Interactive website for a product design and engineering company. Created with Drupal and custom Javascript animations and solutions.',
        images: [],
        type: 'work',
        tags: ['animation', 'front-end', 'web'],
        link: 'https://www.designcentral.com/'
    },
    {
        title: 'The Laughing Cow',
        classSuffix: 'laughing-cow',
        subTitle: 'New and Old techniques used on this playful website for this well known dairy company.',
        images: [],
        type: 'work',
        tags: ['animation', 'front-end', 'web'],
        link: 'https://www.thelaughingcow.com/'
    },
    {
        title: 'Moab',
        classSuffix: 'moab',
        subTitle: 'Exploring the Arches and desert walls of Moab, Utah.',
        images: [],
        type: 'life',
        tags: ['photography', 'adventure', 'travels'],
        link: 'https://www.instagram.com/p/BmLlaDSgp6d/'
    },
    {
        title: 'Yosemite',
        classSuffix: 'yosemite',
        subTitle: 'A trip inside my favorite desktop wallpaper.',
        images: [],
        type: 'life',
        tags: ['photography', 'adventure', 'travels'],
        link: 'https://www.instagram.com/p/BmLlaDSgp6d/'
    }
];

const gridItems = projects.map((proj, index) => 
    <div className={'grid_row grid_row-' + proj.classSuffix + ' grid_type-' + proj.type} key={index}>
        <div className="grid_item">{proj.title}</div>
    </div>
);

class Hero extends Component {
    constructor(props) {
        super(props);
    }

    clearFilters() {
        
    }

    render() {
        return (
            <div className="heroSection">
                <div className="bgtext">DrewHaas</div>
                <div className="grid_container">{gridItems}</div>
                <div className="rightAccentText" onClick={this.clearFilters}>Clear</div>
                {/* <p>Welcome. My name is Drew Haas and I'm a Web Developer from Columbus, Ohio currently living in San Francisco.</p> */}
            </div>
        );
    }
}

export default Hero;