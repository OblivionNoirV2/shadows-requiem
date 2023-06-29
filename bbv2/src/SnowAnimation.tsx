import React from 'react';
import './snow.css';

const SnowAnimation = () => {
    const createFlakes = () => {
        //init array to hold the snowflakes
        const flakes = [];
        for (let i = 0; i < 175; i++) {
            flakes.push(
                <div className="flake"
                    key={i}
                    style={{
                        animationDuration: `${Math.random() * 3 + 3.5}s`,
                        animationDelay: `${Math.random() * 1}s`,
                        left: `${Math.random() * 100}vw`
                    }}
                />);
        }
        return flakes;
    };

    return <div className="snow">{createFlakes()}</div>;
};

export default SnowAnimation;
