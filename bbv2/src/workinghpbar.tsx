import React, { createContext, useState, useContext, useEffect } from 'react';

const sm = {
    boss_stats: {
        hp: 100,
        max_hp: 200,
    },
};

interface PlayerMenuProps {
    player: string;
    isPlayerTurn: boolean;
}

export const BossContext = createContext<{
    BossHP: number;
    setBossHP: (value: number) => void;
}>({
    BossHP: sm.boss_stats.hp,
    setBossHP: () => { },
});

const PlayerMenu: React.FC<PlayerMenuProps> = ({ player, isPlayerTurn }) => {
    const { setBossHP } = useContext(BossContext);

    const handleAttack = () => {
        const new_hp = Math.max(0, Math.floor(Math.random() * 100));
        setBossHP(new_hp);
    };

    return (
        <div>
            <button onClick={handleAttack}>Attack</button>
        </div>
    );
};

const BossHpBar = () => {
    const { BossHP } = useContext(BossContext);

    return (
        <div>
            <h2>Boss HP: {BossHP}</h2>
            <progress value={BossHP} max={sm.boss_stats.max_hp}></progress>
        </div>
    );
};

const ContextManagement = () => {
    const [BossHP, setBossHP] = useState(sm.boss_stats.hp);

    useEffect(() => {
        console.log('BossHP updated:', BossHP);
    }, [BossHP]);

    return (
        <BossContext.Provider value={{ BossHP, setBossHP }}>
            <PlayerMenu player="" isPlayerTurn={false} />
            <BossHpBar />
        </BossContext.Provider>
    );
};

export default function App() {
    return <ContextManagement />;
}

export { };
