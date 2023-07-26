import React from 'react';
import './snow.css';
import { Randomizer } from './PlayerActions';
import { StringMappingType } from 'typescript';


const SnowAnimation: React.FC<{ precip_type: string }> = ({ precip_type }) => {
    const createFlakes = () => {
        //init array to hold the snowflakes
        const flakes = [];
        let amount;
        if (precip_type === 'confetti') {
            amount = 80
        } else {
            amount = 160
        }
        for (let i = 0; i < amount; i++) {
            flakes.push(
                <div className={`${precip_type}`}
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
