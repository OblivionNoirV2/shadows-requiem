import React from 'react';
import './snow.css';

const SnowAnimation = () => {
    const createDrops = () => {
        //init array to hold the drops
        const drops = [];
        for (let i = 0; i < 150; i++) {
            drops.push(
                <div className="drop"
                    key={i}
                    style={{
                        animationDuration: `${Math.random() * 3 + 2.5}s`,
                        animationDelay: `${Math.random() * 1}s`,
                        left: `${Math.random() * 100}vw`
                    }}
                />);
        }
        return drops;
    };

    return <div className="snow">{createDrops()}</div>;
};

export default SnowAnimation;
