import { createContext, useState } from 'react';
import * as sm from './StatManagement';
import { PlayerMenu, BossHpBar, BossArea, MainPage } from './MainPage';
//used for the boss hp bar

interface BossContextValue {
    BossHP: number;
    setBossHP: (value: number) => void;  // Function that takes a number
}

// Initialize the context with that type
export const BossContext = createContext<BossContextValue>({
    BossHP: 0,
    setBossHP: () => { }, // a no-op function as default
});


function ContextManagement() {
    const [BossHP, setBossHP] = useState(sm.boss_stats.hp);

    return (
        <BossContext.Provider value={{ BossHP, setBossHP }}>
            <PlayerMenu player='' isPlayerTurn={false} />
            <BossArea />
            <BossHpBar />
        </BossContext.Provider>
    )
}

export default ContextManagement;