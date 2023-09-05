//add a cool flickering animation to the title
import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import YouDied from './YouDied';
import { PrecipTypeContext } from './Context';

import * as sfx from './sfxManagement';
interface StartMenuProps {
    on_start: () => void;
    bossStage: number

}
//use this instead of context because the places it's needed can't use hooks
export let selected_difficulty: string = 'normal';

const StartMenu: React.FC<StartMenuProps> = ({ on_start, bossStage }) => {
    const [isCreditsShown, setIsCreditsShown] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
    useEffect(() => {
        selected_difficulty = selectedDifficulty;
        console.log('selected difficulty:', selected_difficulty);
    }, [selectedDifficulty]);

    useEffect(() => {
        if (bossStage === 3) {
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor = "rgb(0,0,0)"
        }

    }, [bossStage])
    //toggle showing credits on/off
    function handleCreditsClick() {
        setIsCreditsShown(!isCreditsShown);
    }

    const handleDiffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDifficulty(e.target.value);
    }

    interface StartMenuButtonProps {
        text: string;
        link?: string;
        onClick: () => void; //this is whatever is passed in below
    }
    const StartMenuButton: React.FC<StartMenuButtonProps> = ({ text, link, onClick }) => {
        return (
            <button onClick={onClick} className='bg-[#363040]/60 
            py-6 px-4 rounded-2xl text-6xl text-slate-400 mt-10 
            glow-ani-border'>
                {
                    link ?
                        <Link to={link}>
                            {text}
                        </Link> :
                        text
                }
            </button>
        );
    }
    const { precipType, setPrecipType } = useContext(PrecipTypeContext)
    useEffect(() => {
        setPrecipType("flake")

    }, [])

    const [isCompatible, setIsCompatible] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspectRatio = width / height;

            // Replace 1.77 with the aspect ratio you consider to be "desktop"
            if (aspectRatio < 1.77) {
                setIsCompatible(false);
            } else {
                setIsCompatible(true);
            }
        };

        // Initial check
        handleResize();

        // Listen for window resize events
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <div>
            {isCompatible ? (
                <main className='flex flex-col mx-auto w-2/3
   justify-center items-center space-y-4 mt-12 '>
                    <h1 className='text-8xl glow-ani-text text-black'>影の鎮魂歌</h1>
                    <hr className='bg-black glow-ani-text h-2 w-full border-none'></hr>
                    <h1 className='text-6xl glow-ani-text text-black'>Shadow's Requiem</h1>
                    <div className='flex'>
                        <section className='start-menu space-y-8 flex flex-col'>
                            <div className='flex flex-col space-y-8'>

                                <StartMenuButton
                                    text='Start Game'
                                    onClick={() => {
                                        on_start();
                                        sfx.playClickSfx();
                                    }}
                                />
                                <StartMenuButton
                                    text='Story'
                                    link='/Story'
                                    onClick={sfx.playClickSfx}
                                />
                                <StartMenuButton
                                    text='Encyclopedia'
                                    link='/Encyclopedia'
                                    onClick={sfx.playClickSfx}
                                />

                                <select className=' bg-[#363040]/60 
       py-4 px-3 rounded-2xl text-6xl text-center text-slate-400 glow-ani-border
       diff-select'
                                    onChange={handleDiffChange}
                                    onClick={() => sfx.playClickSfx}
                                    title='Selected difficulty'
                                >
                                    <option disabled>
                                        Select difficulty...
                                    </option>
                                    <option
                                        title='Reduces boss attack and defense by 50%'
                                        value='very_easy'>
                                        Very Easy
                                    </option>
                                    <option
                                        title='Reduces boss attack and defense by 25%'
                                        value='easy'>
                                        Easy
                                    </option>
                                    <option
                                        selected
                                        title='Standard, no changes'
                                        value='normal'>
                                        Normal
                                    </option>
                                    <option
                                        title='Raises boss attack and defense by 25%'
                                        value='hard'>
                                        Hard
                                    </option>
                                    <option
                                        title='Raises boss attack and defense by 50%'
                                        value='nightmare'>
                                        Nightmare
                                    </option>
                                </select>
                                <StartMenuButton
                                    text='Name Characters'
                                    onClick={sfx.playClickSfx}
                                    link='/NameCharacters'
                                />
                                <StartMenuButton
                                    text='Credits'
                                    onClick={() => {
                                        handleCreditsClick();
                                        sfx.playClickSfx();
                                    }}
                                />
                            </div>
                        </section>
                        {isCreditsShown &&
                            <section className='flex flex-col m-auto items-center 
           bg-[#363040]/60 py-8 px-4 glow-ani-border rounded-2xl 
          text-xl ml-4 '>
                                <strong className='flex flex-col space-y-6 text-white'>
                                    <cite>Programmer: Benjamin Donahue</cite>
                                    <cite>Designer: Benjamin Donahue</cite>
                                    <cite>Music: Benjamin Donahue</cite>
                                    <cite>Images: Midjourney AI </cite>
                                    <cite>Volume on symbol: Pixel Perfect</cite>
                                    <cite>Volume off symbol: Google</cite>
                                    <cite className='cite-link'>SFX:
                                        <a href='https://opengameart.org/'
                                            target='_blank'>
                                            OpenGameArt.Org,
                                        </a>
                                        <br></br>
                                        <a href='https://www.youtube.com/@SoundEffectsFactory'
                                            target='_blank'>
                                            SoundEffectsFactory
                                        </a>
                                        <br></br>
                                        <a href='https://mixkit.co/free-sound-effects/horror/'
                                            target='_blank'>
                                            MixKit
                                        </a>
                                        <br></br>
                                        <a href='https://tuna.voicemod.net/sound/d23c1e88-eb51-448e-8ad1-9abde6e2cad7'
                                            target='_blank'>
                                            Voicemod
                                        </a>
                                    </cite>
                                </strong>

                            </section>

                        }
                    </div>


                </main>

            ) : (
                <h1 className='text-5xl text-white justify-center flex w-1/2 mx-auto'>
                    Sorry, this game is only intended for desktops and laptops.
                </h1>
            )}
        </div>
    );
};

export default StartMenu;