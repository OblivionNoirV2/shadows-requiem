import React from 'react';
import './snow.css';
import { Randomizer } from './PlayerActions';

const SnowAnimation = () => {
    const createFlakes = () => {
        //init array to hold the snowflakes
        const flakes = [];
        for (let i = 0; i < 160; i++) {
            flakes.push(
                <div className="flake"
                    key={i}
                    style={{
                        animationDuration: `${Math.random() * 3 + 5.5}s`,
                        animationDelay: `${Math.random() * 1}s`,
                        right: `${Math.random() * 100}vw`,
                        scale: `${Math.random() * 0.5 + 0.5}`,

                    }}
                />);
        }
        return flakes;
    };

    return <div className="snow">{createFlakes()}</div>;
};

export default SnowAnimation;
