
import { useEffect, useState } from 'react';
export let seconds: number;//to use in scoring
//a bit weird because I need the seconds 
const Timer = () => {
    const [startTime, setStartTime] = useState(new Date().getTime());
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const updateElapsedTime = () => {
            const now = new Date().getTime();
            setElapsedTime(now - startTime);
        };
        //update every second
        const interval_id = setInterval(updateElapsedTime, 1000);

        return () => {
            clearInterval(interval_id);
        };
        //Runs one time at start
    }, [startTime]);

    const total_seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(total_seconds / 60);
    seconds = total_seconds % 60;
    const hours = Math.floor(minutes / 60); //lol

    return (
        <div className='text-sky-500 ml-16 mr-8'>
            <span>{String(hours).padStart(2, '0')}:</span>
            <span>{String(minutes).padStart(2, '0')}:</span>
            <span>{String(seconds).padStart(2, '0')}</span>
        </div>
    );
};

export default Timer;