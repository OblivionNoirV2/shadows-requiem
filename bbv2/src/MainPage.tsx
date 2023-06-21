import React, { useState, useRef, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import * as sm from './StatManagement';
import * as iv from './Inventory';
import * as pa from './PlayerActions';
import * as sfx from './sfxManagement';
import { BossContext } from './Context';
import { TurnNumberContext } from './Context';
import { RNGResult } from './PlayerActions';
import { KnightMPContext } from './Context';
import { new_set_hp } from './PlayerActions';
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
    const [bossStage, setBossStage] = useState(1);
    //manage boss stage based on hp value 

    console.log("rendered bossarea")
    useEffect(() => {
        if (new_set_hp >= 666666) {
            setBossStage(1);
        } else if (new_set_hp >= 333333 && new_set_hp < 666666) {
            setBossStage(2);
        } else {
            setBossStage(3);
        }
    }, [new_set_hp]);
    //update the boss stage based on the hp value
    useEffect(() => {
        if (bossStage === 2) {
            sm.boss_stats.m_def = 1.25;
            sm.boss_stats.p_def = 1.25;
        } else if (bossStage === 3) {
            sm.boss_stats.m_def = 1.50;
            sm.boss_stats.p_def = 1.50;

        }


    }, [bossStage]);

    //have to specify exact paths because of how webpack works
    const boss_images = [
        require('./assets/images/boss/sprites/phase1v4.png'),
        require('./assets/images/boss/sprites/phase2v3.png'),
        require('./assets/images/boss/sprites/phase3v2.png')
    ];
    const boss_labels = [
        "The Fallen King",
        "Corrupted Shade of the King",
        "True Form of the Fallen"
    ];

    //Set the new boss hp when the attack is run
    //then pass the value up here to update the progress bar

    //todo: same images, but wider AR
    return (
        <main className='boss-container w-full flex flex-col mt-48
        mr-[42rem]
        '>
            <section className='flex flex-col items-center w-[56rem]
             relative'>
                <img
                    src={boss_images[bossStage - 1]}
                    className='boss-sprite opacity-95'
                    alt={`boss phase ${bossStage}`}
                />
                <strong>
                    <div className='flex justify-center relative mt-8
                     z-10 
                    text-4xl
                       text-black stage-label'>
                        {boss_labels[bossStage - 1]}
                    </div>
                </strong>
                <BossHpBar />
            </section>
        </main>
    );
}



interface BossHpBarProps {
    bossHP: number;
}

export const BossHpBar = () => {
    return (
        <progress className={
            'block h-8 glow-ani-border-black boss-prog w-full'
        } value={new_set_hp} max={sm.boss_stats.max_hp}></progress>
    )
}

/*this must be seperate from the image, otherwise it 
renders at the wrong time*/


//fetch and return list of player attacks in ul format
interface PlayerMenuProps {
    player: string;
    isPlayerTurn: boolean;

}

function bossAttackAlgo() {
    //something's off with the turn number

    console.log("boss attack");


}

/*if it's a number, that's the damage dealt. If it's a string,
 it's a miss/critical message. Crits include the message and the damage
all as one string*/

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

    //mp contexts
    const { KnightMP, setKnightMP } = useContext(KnightMPContext);


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

    useEffect(() => {

        bossAttackAlgo();

    }, [TurnNumber, setTurnNumber]);

    const [isAttackMade, setIsAttackMade] = useState(false);
    const [message, setMessage] = useState("");
    function handleAtkClick(attack: string) {
        let atk_result = pa.PlayerAttack(attack);
        console.log("handleclick atkresult:", atk_result);
        setMessage(atk_result);

        setIsAttackAreaShown(true);
        setCurrentAttack(attack);
        /*Using this instead of turns 
        fixes weird bug where the attack area doesn't show up*/
        setIsAttackMade(true);
    }
    return (

        <main className='w-full'>

            {!isAttackMade ?
                <ul className='-mt-24 battle-menu'>
                    {isItemsActive ? null :
                        <li>
                            <button onClick={() => { HandleAttacksMenu(); sfx.playClickSfx(); }}
                            >
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
                        //if there's not enough mp, disable the button and grey it out
                        //Use the encyclopaedia to get the mp cost
                        //Mp subtraction is done HERE, then the bar updates through context
                        <>
                            <div className='w-full gap-x-2 grid grid-cols-3 grid-rows-auto'>

                                {current_attacks.map(
                                    (attack, index) =>
                                        <li key={index} className='atk-btn'>
                                            <button onClick={() => {
                                                handleAtkClick(attack);
                                                setIsAttackAreaShown(true);

                                                sfx.playClickSfx();
                                                {
                                                    setTimeout(() => {
                                                        setTurnNumber(TurnNumber + 1)
                                                        setIsAttackAreaShown(false);
                                                        setIsAttackMade(false);

                                                    }, 2000);
                                                }
                                            }}
                                            >
                                                {attack}
                                            </button>
                                        </li>
                                )
                                }
                            </div>

                        </>
                    }
                </ul>
                :
                <>
                    <section>

                        {isAttackAreaShown &&

                            <PlayerAttackArea
                                attack={currentAttack}
                                player={player}
                                isPlayerTurn={isPlayerTurn}

                            />

                        }
                    </section>
                    <MessageArea message={message} />
                </>

            }
        </main>

    )
}
interface PlayerAttackAreaProps {
    attack: string;
    player: string | null;
    isPlayerTurn: boolean;
}
interface MessageAreaProps {
    message: RNGResult | string;
}
const MessageArea: React.FC<MessageAreaProps> = ({ message }) => {

    useEffect(() => {
        console.log("inside msg area", message)
    }, [message]);

    //convert to proper string if necessary
    const message_string = typeof message === "object"
        ? `${message.crit === true ?
            "Critical hit! " : ""} Damage dealt: ${message.result}`
        : message;
    return (
        <h1 className='text-7xl absolute z-20  text-red-600 ml-[90rem]  '>
            {message_string}
        </h1>
    )
}
//Need to keep this independent of the bossarea component
const PlayerAttackArea: React.FC<PlayerAttackAreaProps> = ({ attack, player, isPlayerTurn }) => {
    let current_attack = pa.selected_attack;
    console.log("current_attack:" + current_attack);
    return (
        <div>
            <span className='w-1/4 ml-[41.5%] mt-[14%] z-[4] rounded-xl 
            absolute top-0 right-0'>

            </span>
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
    const { KnightMP, setKnightMP } = useContext(KnightMPContext);

    useEffect(() => {
        setKnightMP(sm.knight_stats.mp);
    }, [sm.knight_stats.mp]);

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

        //Render the status effects
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

    const { TurnNumber, setTurnNumber } = useContext(TurnNumberContext);
    //gets checked whenever it's the player's turn
    function HandleUltima() {


    }

    return (
        <>
            {/*score tracker*/}
            <strong>
                <section className='text-white text-4xl flex justify-end 
                mr-24 mt-4 -mb-4'>
                    Turn # {TurnNumber}
                </section>
            </strong>
            <main className='w-full flex dark-overlay'>

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
                                    value={KnightMP}>
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
                                className='ultima-bar flex 
                                justify-start w-2/5 mt-4 h-6'
                                value={10} max={20}>
                            </progress>
                        </li>
                    </ul>
                </section>
                <section className=''>
                    <BossArea
                    />
                </section>
            </main>
        </>
    );
};

export default MainPage;