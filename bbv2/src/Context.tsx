/*import { createContext, useState, useEffect } from 'react';
import * as sm from './StatManagement';
import { PlayerMenu, BossHpBar, BossArea, MainPage } from './MainPage';
//used for the boss hp bar

interface BossContextValue {
    BossHP: number;
    setBossHP: (value: number) => void;  // Function that takes a number
}

export const BossContext = createContext<BossContextValue>({
    BossHP: sm.boss_stats.hp,
    setBossHP: () => { },
});


function ContextManagement() {

    const [BossHP, setBossHP] = useState(sm.boss_stats.hp);
    //never updates
    useEffect(() => {
        console.log('BossHP updated:', BossHP);
    }, [BossHP]);
    return (
        <BossContext.Provider value={{ BossHP, setBossHP }}>

            <PlayerMenu player='' isPlayerTurn={false} />

            <BossHpBar />
        </BossContext.Provider>
    )
}

export default ContextManagement;*/

export { };