import React, { useState, useRef, useEffect } from 'react';
import UpdateStats, {
    knight_stats,
    dmage_stats,
    wmage_stats,
    rmage_stats,
    boss_stats
} from './StatManagement';
import * as iv from './Inventory';
import * as pa from './PlayerActions';
import clicksfx from './assets/sound/sfx/selectclick.wav';
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

const BossArea: React.FC<BossAreaProps> = ({ player }) => {
    //manage boss stage based on hp value 
    console.log("rendered bossarea")
    useEffect(() => {
        if (boss_stats.hp >= 666666) {
            setBossStage(1);
        } else if (boss_stats.hp >= 333333 && boss_stats.hp < 666666) {
            setBossStage(2);
        } else {
            setBossStage(3);
        }
    }, [boss_stats.hp]);
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
    const [bossHP, setBossHP] = useState(boss_stats.hp);
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
        </main>
    );
}
/*this must be seperate from the image, otherwise it 
renders at the wrong time*/

interface BossHpBarProps {
    bossHP: number;
}
const BossHpBar: React.FC<BossHpBarProps> = ({ bossHP }) => {
    return (
        <progress className={
            'block h-8 glow-ani-border-black boss-prog '
        } value={bossHP} max={boss_stats.max_hp}></progress>
    )
}
//fetch and return list of player attacks in ul format
interface PlayerMenuProps {
    player: string;

}
const PlayerMenu: React.FC<PlayerMenuProps> = ({ player }) => {
    //note that this re-renders whenever the player is selected
    //this section is also responsible for rendering the attack menu
    console.log("rendered")
    const current_attacks = player_attacks[player];
    //if it's active, hide the other options
    const [isAttacksActive, setIsAttacksActive] = useState(false);
    const [isItemsActive, setIsItemsActive] = useState(false);
    const HandleItemsMenu = () => setIsItemsActive(!isItemsActive);
    const [isAttackAreaShown, setIsAttackAreaShown] = useState(false);
    const [BossHP, setBossHP] = useState(boss_stats.hp);
    function HandleItemUse(item: string) {
        console.log("working");
    };

    function HandleAttacksMenu() {
        setIsAttacksActive(!isAttacksActive);
        console.log("AA: " + isAttacksActive);
    }
    //do the same for attacks
    function GetItemDesc(item: any): string {
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
    const [currentAttack, setCurrentAttack] = useState("");
    //clicking the top button will show attacks and remove the other two
    //if the attacks are shown, change "attacks" to "back"
    return (
        <ul className='-mt-24 battle-menu'>
            {isItemsActive ? null :
                <li>
                    <button onClick={HandleAttacksMenu}>
                        {isAttacksActive ? "Back" : "Attacks"}
                    </button>
                </li>
            }
            {!isAttacksActive ?
                <>
                    <li>
                        <button onClick={HandleItemsMenu}>
                            {isItemsActive ? "Back" : "Items"}
                        </button>
                    </li>
                    <div className='flex flex-row space-x-4'>
                        {isItemsActive &&
                            Object.entries(iv.player_inventory).map(([item, quantity], index) => (
                                <li key={index} className='atk-btn'>
                                    <button onClick={() => HandleItemUse(item)}
                                        title={GetItemDesc(item)}>
                                        {item} ({quantity})
                                    </button>
                                </li>
                            ))
                        }
                    </div>
                    {isItemsActive ? null :
                        <li>
                            <button>
                                Defend
                            </button>
                        </li>
                    }
                </>
                :
                //map the list to a ul 
                <>
                    <div className=' grid grid-cols-2 grid-rows-2'>
                        {current_attacks.map(
                            (attack, index) =>
                                <li key={index} className='atk-btn'>
                                    <button onClick={() => {
                                        pa.PlayerAttack(attack);
                                        setIsAttackAreaShown(!isAttackAreaShown);
                                        setCurrentAttack(attack)
                                    }}>
                                        {attack}
                                    </button>
                                </li>
                        )}
                    </div>
                    <section>
                        {isAttackAreaShown &&
                            <PlayerAttackArea
                                attack={currentAttack}
                                player={player}
                            />
                        }
                    </section>

                    <section className='absolute'>
                        <BossHpBar bossHP={BossHP}
                        />
                    </section>
                </>

            }
        </ul>
    )
}
interface PlayerAttackAreaProps {
    attack: string;
    player: string | null;

}
//Need to keep this independent of the bossarea component
const PlayerAttackArea: React.FC<PlayerAttackAreaProps> = ({ attack, player }) => {
    let current_attack = pa.selected_attack;
    console.log("current_attack:" + current_attack);
    return (
        <pa.ShowAttack
            attack={current_attack}
            player={player}
        />
    )

}
//onBackToTitle is a void function that comes from the interface
//in the render below it flips the state of the page to the title
const MainPage: React.FC<GoBackProps> = ({ onBackToTitle }) => {
    //state holds a string to hold the selected character, or null to reset it
    //default null because no outline should be shown on load
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isUltimaReady, setIsUltimaReady] = useState(false);
    //Manage the turn based system
    //Score will go up by 1 each player turn
    function HandleScore() {
        setScore(score + 1);
        console.log("Score: " + score);
    }

    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const click = new Audio(clicksfx);
    function HandleSelection(sel_character: string): void {

        if (selectedCharacter === sel_character) {
            //If the selected character is clicked again, deselect it
            setSelectedCharacter(null);
        } else {
            //Otherwise, select the clicked character
            setSelectedCharacter(sel_character);
        }
        click.play();
        click.volume = 0.5;
    }

    //Status effects, these will be image sources
    //poison - 5% of max hp per turn
    //curse - insta death in 10 turns
    //frozen - can't move for 3 turns
    const knight_status_effects: string[] = [
        "poison.png",
        "curse.png",
        "freeze.png"
    ];
    const dmage_status_effects: string[] = [
        "poison.png",
        "curse.png",
        "freeze.png"

    ];
    const wmage_status_effects: string[] = [
        "poison.png",
        "curse.png",
        "freeze.png"

    ];
    const rmage_status_effects: string[] = [
        "poison.png",
        "curse.png",
        "freeze.png"

    ];
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

    //can probably clean this up
    function UpdateStatusEffects(player: string) {
        switch (player) {
            case "knight":
                return (
                    knight_status_effects.map((status_effect, index) =>
                        <ul key={index}>
                            <li>
                                <img src={
                                    require(`./assets/images/icons/${status_effect}`)}
                                    alt={status_effect}
                                    /*style differently depending on the effect*/
                                    className={getClassName(status_effect)}
                                    title={GetStatusEffectDesc(status_effect)}
                                />
                            </li>
                        </ul>
                    )
                );
            case "dmage":
                return (
                    dmage_status_effects.map((status_effect, index) =>
                        <ul className='flex flex-row' key={index}>
                            <li>
                                <img src={
                                    require(`./assets/images/icons/${status_effect}`)}
                                    alt={status_effect}
                                    className={getClassName(status_effect)}
                                />
                            </li>
                        </ul>
                    )
                );
            case "wmage":
                return (
                    wmage_status_effects.map((status_effect, index) =>
                        <ul key={index}>
                            <li key={index}>
                                <img src={
                                    require(`./assets/images/icons/${status_effect}`)}
                                    alt={status_effect}
                                    className={getClassName(status_effect)}
                                />
                            </li>
                        </ul>
                    )
                );
            case "rmage":
                return (
                    wmage_status_effects.map((status_effect, index) =>
                        <ul key={index}>
                            <li key={index}>
                                <img src={
                                    require(`./assets/images/icons/${status_effect}`)}
                                    alt={status_effect}
                                    className={getClassName(status_effect)}
                                />
                            </li>
                        </ul>
                    )
                );
        }
    };
    //gets checked whenever it's the player's turn
    function HandleUltima() {


    }

    return (
        <>
            {/*score tracker*/}
            <strong>
                <section className='text-white text-4xl flex justify-end 
                mr-24 mt-4 -mb-4'>
                    Score: {score}
                </section>
            </strong>
            <main className='w-full h-screen flex dark-overlay'>

                {/*party members*/}
                <section className='party-col w-full h-full flex 
                flex-col -mt-4 ml-4'>
                    <ul className='w-full'>
                        <li>
                            <div>
                                <button className='4 text-lg
                                 text-white '
                                    onClick={onBackToTitle}>Back to title</button>
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
                                <progress className='p-hp' max={knight_stats.hp}></progress>
                                <div>MP</div>
                                <progress className='mb-4 p-mb'
                                    max={knight_stats.mp}
                                    value={knight_stats.mp}>
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
                                    max={dmage_stats.hp}
                                    value={dmage_stats.hp}>
                                </progress>
                                <div>MP</div>
                                <progress className='mb-4 p-mb' max={dmage_stats.mp}></progress>
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
                                    max={wmage_stats.hp}
                                    value={wmage_stats.hp}>
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
                                    max={rmage_stats.hp}
                                    value={rmage_stats.mp}>
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
                        player={selectedCharacter} />
                </section>
            </main>
        </>
    );
}

export default MainPage;