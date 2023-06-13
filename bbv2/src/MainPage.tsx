import React, { useState, useRef, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import * as sm from './StatManagement';
import * as iv from './Inventory';
import * as pa from './PlayerActions';
import * as sfx from './sfxManagement';
import { BossContext } from './Context';
import { TurnNumberContext } from './Context';
interface GoBackProps {
    onBackToTitle: () => void;
}

interface MenuProps {
    current_player: string;
}
interface AttackList {
    [key: string]: string[];
}
interface ItemList {
    [key: string]: number[];
}
//match keywords to the lists above
const player_attacks: AttackList = {
    knight: pa.knight_attacks,
    dmage: pa.dmage_attacks,
    wmage: pa.wmage_attacks,
    rmage: pa.rmage_attacks
};


//can use player to retrieve the attacks just like in the below components
interface BossAreaProps {
    player: string | null;

}

export const BossArea = () => {
    //manage boss stage based on hp value 
    const { BossHP } = useContext(BossContext);
    console.log("rendered bossarea")
    useEffect(() => {
        if (BossHP >= 666666) {
            setBossStage(1);
        } else if (BossHP >= 333333 && BossHP < 666666) {
            setBossStage(2);
        } else {
            setBossStage(3);
        }
    }, [BossHP]);
    function HandleBossStage(stage: number) {
        setBossStage(stage);
    }
    const [bossStage, setBossStage] = useState(1);
    //have to specify exact paths because of how webpack works
    const boss_images = [
        require('./assets/images/boss/sprites/phase1anime.png'),
        require('./assets/images/boss/sprites/phase2anime.png'),
        require('./assets/images/boss/sprites/phase3anime.png')
    ];
    const boss_labels = [
        "The Fallen King",
        "Corrupted Shade of the King",
        "True Form of the Fallen"
    ];

    //Set the new boss hp when the attack is run
    //then pass the value up here to update the progress bar
    return (
        <main className='boss-container w-full flex flex-col mt-44 mr-56 z-[1]'>
            <section className='flex flex-col w-[96rem] relative'>
                <img
                    src={boss_images[bossStage - 1]}
                    className='boss-sprite opacity-95'
                    alt={`boss phase ${bossStage}`}

                />
                <strong>
                    <div className='flex justify-center mt-8 text-4xl mx-auto text-white'>
                        {boss_labels[bossStage - 1]}
                    </div>
                </strong>
            </section>
            <section className='w-full'>
                <BossHpBar />
            </section>
        </main>
    );
}

interface BossHpBarProps {
    bossHP: number;
}
//Will need to use global state/context api to retrieve the state 
//from the mainpage component
//Check the STATE as a dependency, not the stat itself. The stat is already 
//updated and passed to the state by this point
export const BossHpBar = () => {
    const { BossHP } = useContext(BossContext);

    return (
        <progress className={
            'block h-8 glow-ani-border-black boss-prog w-10/12'
        } value={BossHP} max={sm.boss_stats.max_hp}></progress>
    )
}

/*this must be seperate from the image, otherwise it 
renders at the wrong time*/


//fetch and return list of player attacks in ul format
interface PlayerMenuProps {
    player: string;
    isPlayerTurn: boolean;

}

export const PlayerMenu: React.FC<PlayerMenuProps> = ({ player, isPlayerTurn }) => {
    //note that this re-renders whenever the player is selected
    //this section is also responsible for rendering the attack menu
    console.log("player menu rendered")
    const current_attacks = player_attacks[player];
    //if it's active, hide the other options
    const [isAttacksActive, setIsAttacksActive] = useState(false);
    const [isItemsActive, setIsItemsActive] = useState(false);
    const HandleItemsMenu = () => setIsItemsActive(!isItemsActive);
    const [isAttackAreaShown, setIsAttackAreaShown] = useState(false);
    useEffect(() => {
        if (isPlayerTurn) {

            console.log("turn number: ");
        }
    }, [isPlayerTurn]);
    function HandleItemUse(item: string) {
        console.log("working");
    };

    function HandleAttacksMenu() {
        setIsAttacksActive(!isAttacksActive);
        console.log("AA: " + isAttacksActive);
    }
    //do the same for attacks
    function GetItemDesc(item: string): string {
        switch (item) {
            case "HP Potion":
                return "Restores 50% of one character's HP";
            case "MP Potion":
                return "Restores 50% of one character's MP";
            case "Revive":
                return "Revives a character with 60% HP";
        }
        return "";
    }
    function HandleDefend() {

    }

    const [currentAttack, setCurrentAttack] = useState("");
    //clicking the top button will show attacks and remove the other two
    //if the attacks are shown, change "attacks" to "back"

    const { BossHP, setBossHP } = useContext(BossContext);
    const { TurnNumber, setTurnNumber } = useContext(TurnNumberContext);
    console.log({ BossHP });
    return (
        <>
            {TurnNumber.slice(-1)[0] % 2 == 0 ?
                <ul className='-mt-24 battle-menu'>
                    {isItemsActive ? null :
                        <li>
                            <button onClick={() => { HandleAttacksMenu(); sfx.playClickSfx(); }}>
                                {isAttacksActive ? "Back" : "Attacks"}
                            </button>
                        </li>
                    }
                    {!isAttacksActive ?
                        <>
                            <li>
                                <button onClick={() => { sfx.playClickSfx(); HandleItemsMenu() }}>
                                    {isItemsActive ? "Back" : "Items"}
                                </button>
                            </li>
                            <div className='flex flex-row space-x-4'>
                                {isItemsActive &&
                                    Object.entries(iv.player_inventory).map(([item, quantity], index) => (
                                        <li key={index} className='atk-btn'>
                                            <button onClick={() => { HandleItemUse(item); sfx.playClickSfx(); }}
                                                title={GetItemDesc(item)}>
                                                {item} ({quantity})
                                            </button>
                                        </li>
                                    ))
                                }
                            </div>
                            {isItemsActive ? null :
                                <li>
                                    <button onClick={() => { HandleDefend(); sfx.playClickSfx() }} >
                                        Defend
                                    </button>
                                </li>
                            }
                        </>
                        :

                        <>
                            <div className=' grid grid-cols-2 grid-rows-2'>


                                {current_attacks.map(
                                    (attack, index) =>
                                        <li key={index} className='atk-btn'>
                                            <button onClick={() => {
                                                pa.PlayerAttack(attack, BossHP, setBossHP);
                                                //this is now working
                                                //up the turn after the attack
                                                TurnNumber.push(TurnNumber.slice(-1)[0] + 1);
                                                setIsAttackAreaShown(true);
                                                setCurrentAttack(attack);

                                                sfx.playClickSfx();
                                                {
                                                    setTimeout(() => {
                                                        setIsAttackAreaShown(false);
                                                    }, 3000);
                                                }
                                            }}>
                                                {attack}
                                            </button>
                                        </li>
                                )

                                }


                            </div>

                        </>
                    }
                </ul>
                : <section>

                    {isAttackAreaShown &&

                        <PlayerAttackArea
                            attack={currentAttack}
                            player={player}
                            isPlayerTurn={isPlayerTurn}
                        />

                    }
                </section>
            }
        </>
    )
}
interface PlayerAttackAreaProps {
    attack: string;
    player: string | null;
    isPlayerTurn: boolean;

}

//Need to keep this independent of the bossarea component
const PlayerAttackArea: React.FC<PlayerAttackAreaProps> = ({ attack, player, isPlayerTurn }) => {

    let current_attack = pa.selected_attack;
    console.log("current_attack:" + current_attack);
    return (

        <div className='z-[4]'>
            <pa.ShowAttack
                attack={current_attack}
                player={player}
                isPlayerTurn={isPlayerTurn}
            />
        </div>
    )

}
//Status effects, these will be image sources
//poison - 5% of max hp per turn
//curse - insta death in 10 turns
//frozen - can't move for 3 turns
const StatusEffectsHash: { [name: string]: string } = {
    "Poison": "poison.png",
    "Curse": "curse.png",
    "Freeze": "freeze.png",
}
//onBackToTitle is a void function that comes from the interface
//in the render below it flips the state of the page to the title

//then pass the given global state to the playermenu
export const MainPage: React.FC<GoBackProps> = ({ onBackToTitle }) => {
    //const { setBossHP } = useContext(BossHPContext);
    //state holds a string to hold the selected character, or null to reset it
    //default null because no outline should be shown on load
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

    const [isUltimaReady, setIsUltimaReady] = useState(false);
    //Manage the turn based system
    //Score will go up by 1 each player turn

    console.log("MainPage rendered");
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    function HandleSelection(sel_character: string): void {

        if (selectedCharacter === sel_character) {
            //If the selected character is clicked again, deselect it
            setSelectedCharacter(null);
        } else {
            //Otherwise, select the clicked character
            setSelectedCharacter(sel_character);
        }
        sfx.playClickSfx();
    }



    //assign the correct class name to the status effect
    function getClassName(status_effect: string): string {
        switch (status_effect) {
            case "poison.png":
                return 'w-6 status-icon status-icon-poison';
            case "curse.png":
                return 'w-6 status-icon status-icon-curse';
            case "freeze.png":
                return 'w-6 status-icon status-icon-freeze';
            default:
                return '';
        }
    }
    function GetStatusEffectDesc(status_effect: string): string {
        switch (status_effect) {
            case "poison.png":
                return "Poisoned";
            case "curse.png":
                return "Cursed";
            case "freeze.png":
                return "Frozen";
            default:
                return '';
        }
    }

    //these will all be state
    function UpdateStatusEffects(player: string) {
        // Map the player to the corresponding status effects array
        let status_effects: string[];
        switch (player) {
            case "knight":
                status_effects = [];
                break;
            case "dmage":
                status_effects = []
                break;
            case "wmage":
                status_effects = []
                break;
            case "rmage":
                status_effects = []
                break;
            default:
                status_effects = [];
                break;
        }

        // Render the status effects
        return (
            status_effects.map((status_effect, index) => (
                <ul key={index}>
                    <li>
                        <img
                            src={require(`./assets/images/icons/${status_effect}`)}
                            alt={status_effect}
                            className={getClassName(status_effect)}
                            title={GetStatusEffectDesc(status_effect)}
                        />
                    </li>
                </ul>
            ))
        );
    }


    //gets checked whenever it's the player's turn
    function HandleUltima() {


    }

    return (
        <>
            {/*score tracker*/}
            <strong>
                <section className='text-white text-4xl flex justify-end 
                mr-24 mt-4 -mb-4'>
                    Turn #: (turn number)
                </section>
            </strong>
            <main className='w-full h-screen flex dark-overlay'>

                {/*party members*/}
                <section className='party-col w-full h-full flex 
                flex-col -mt-4 ml-4'>
                    <ul className='w-full'>
                        <li>
                            <div>
                                <Link to='/Startmenu' >
                                    <button className='4 text-lg
                                 text-white '
                                        onClick={() => { sfx.playClickSfx(); onBackToTitle() }}>
                                        Back to title
                                    </button>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <button onClick={
                                isPlayerTurn ?
                                    () => HandleSelection("knight")
                                    : undefined
                            }
                                className={
                                    selectedCharacter === 'knight' ? 'is-selected' : 'is-not-selected'}>
                                <img src={require('./assets/images/player/sprites/knight.png')}
                                    alt='knight'></img>
                            </button>
                            <span>
                                {
                                    isPlayerTurn && selectedCharacter === 'knight' &&
                                    <PlayerMenu
                                        player='knight'
                                        isPlayerTurn={isPlayerTurn}
                                    />

                                }
                                <section className='flex flex-row text-white'>
                                    <h1 className='mr-4 text-xl'>HP</h1>
                                    {/*these will need to update each boss attack 
                                    (on odd turn numbers)*/}
                                    <ul className='flex flex-row space-x-4'>
                                        {UpdateStatusEffects('knight')}
                                    </ul>
                                </section>
                                <progress className='p-hp' max={sm.knight_stats.hp}></progress>
                                <div>MP</div>
                                <progress className='mb-4 p-mb'
                                    max={sm.knight_stats.mp}
                                    value={sm.knight_stats.mp}>
                                </progress>
                            </span>
                        </li>
                        <li>
                            <button onClick={
                                isPlayerTurn ?
                                    () => HandleSelection("dmage")
                                    : undefined
                            }
                                className={selectedCharacter === 'dmage' ? 'is-selected' : 'is-not-selected'}>
                                <img src={require('./assets/images/player/sprites/dmage.png')}
                                    alt='dark mage'></img>
                            </button>
                            <span>
                                {
                                    isPlayerTurn && selectedCharacter === 'dmage' &&
                                    <PlayerMenu
                                        player='dmage'
                                        isPlayerTurn={isPlayerTurn}

                                    />

                                }
                                <section className='flex flex-row text-white'>
                                    <h1 className='mr-4 text-xl'>HP</h1>
                                    {/*these will need to update each boss attack 
                                    (on odd turn numbers)*/}
                                    <ul className='flex flex-row space-x-4'>
                                        {UpdateStatusEffects('dmage')}
                                    </ul>
                                </section>
                                <progress className='p-hp'
                                    max={sm.dmage_stats.hp}
                                    value={sm.dmage_stats.hp}>
                                </progress>
                                <div>MP</div>
                                <progress className='mb-4 p-mb' max={sm.dmage_stats.mp}></progress>
                            </span>
                        </li>
                        <li>
                            <button onClick={
                                isPlayerTurn ?
                                    () => HandleSelection("wmage") :
                                    undefined
                            }
                                className={selectedCharacter === 'wmage' ? 'is-selected' : 'is-not-selected'}>
                                <img src={require('./assets/images/player/sprites/wmage.png')}
                                    alt='white mage'></img>
                            </button>
                            <span>
                                {
                                    isPlayerTurn && selectedCharacter === 'wmage' &&
                                    <PlayerMenu
                                        player='wmage'
                                        isPlayerTurn={isPlayerTurn}

                                    />

                                }
                                <section className='flex flex-row text-white'>
                                    <h1 className='mr-4 text-xl'>HP</h1>
                                    {/*these will need to update each boss attack 
                                    (on odd turn numbers)*/}
                                    <ul className='flex flex-row space-x-4'>
                                        {UpdateStatusEffects('wmage')}
                                    </ul>
                                </section>
                                <progress className='p-hp'
                                    max={sm.wmage_stats.hp}
                                    value={sm.wmage_stats.hp}>
                                </progress>
                                <div>MP</div>
                                <progress className='mb-4 p-mb'></progress>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => HandleSelection("rmage")}
                                className={selectedCharacter === 'rmage' ? 'is-selected' : 'is-not-selected'}>
                                <img src={require('./assets/images/player/sprites/rmage.png')}
                                    alt='red mage'></img>
                            </button>
                            <span>
                                {
                                    isPlayerTurn && selectedCharacter === 'rmage' &&
                                    <PlayerMenu
                                        player='rmage'
                                        isPlayerTurn={isPlayerTurn}

                                    />

                                }
                                <section className='flex flex-row text-white'>
                                    <h1 className='mr-4 text-xl'>HP</h1>
                                    {/*these will need to update each boss attack 
                                    (on odd turn numbers)*/}
                                    <ul className='flex flex-row space-x-4'>
                                        {UpdateStatusEffects('rmage')}
                                    </ul>
                                </section>
                                <progress className='p-hp'
                                    max={sm.rmage_stats.hp}
                                    value={sm.rmage_stats.mp}>
                                </progress>
                                <div>MP</div>
                                <progress className='mb-4 p-mb'></progress>
                            </span>
                        </li>
                        <li className=''>
                            {/*Goes up each player turn,by 2, to 20*/}
                            <progress
                                className='ultima-bar flex justify-start w-4/5 mt-4 h-6'
                                value={10} max={20}>
                            </progress>
                        </li>
                    </ul>
                </section>
                <section>
                    <BossArea
                    />
                </section>
            </main>
        </>
    );
}

export default MainPage;