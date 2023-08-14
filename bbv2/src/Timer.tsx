import React from 'react';

const Timer = ({ minutes, seconds }: { minutes: number, seconds: number }) => {
    return (
        <div className='text-sky-500 ml-16 mr-8'>
            <span>{String(minutes).padStart(2, '0')}:</span>
            <span>{String(seconds).padStart(2, '0')}</span>
        </div>
    );
};

export default Timer;
