import React, { Component } from 'react';

class Hero extends Component {
    render() {
        return (
            <div className="heroSection">
                <div className="bgtext">DrewHaas</div>
                <div className="grid_container">
                    <div className="grid_item grid_item-1">1</div>
                    <div className="grid_item grid_item-2">2</div>
                    <div className="grid_item grid_item-3">3</div>
                    <div className="grid_item grid_item-4">4</div>
                    <div className="grid_item grid_item-5">5</div>
                    <div className="grid_item grid_item-6">6</div>
                    <div className="grid_item grid_item-7">7</div>
                    <div className="grid_item grid_item-8">8</div>
                </div>
            </div>
        );
    }
}

export default Hero;