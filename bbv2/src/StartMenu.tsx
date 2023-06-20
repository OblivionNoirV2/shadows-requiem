//add a cool flickering animation to the title
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import * as sfx from './sfxManagement';
interface StartMenuProps {
    on_start: () => void;

}

const StartMenu: React.FC<StartMenuProps> = ({ on_start }) => {
    const [isCreditsShown, setIsCreditsShown] = useState(false);
    //toggle showing credits on/off
    function handleCreditsClick() {
        setIsCreditsShown(!isCreditsShown);
    }


    return (
        <main className='flex flex-col mx-auto w-2/3
   justify-center items-center space-y-4 mt-12 '>
            <h1 className='text-8xl text-black glow-ani-text'>影の鎮魂歌</h1>
            <hr className='bg-black glow-ani-text h-2 w-full border-none'></hr>
            <h1 className='text-6xl glow-ani-text text-black'>Shadow's Requiem</h1>
            <section className='start-menu space-y-8 flex flex-row'>
                <div className='flex flex-col space-y-8'>
                    <button onClick={() => { on_start(); sfx.playClickSfx(); }} className='bg-[#363040]/60 
       py-8 px-6 rounded-2xl text-7xl text-slate-400 mt-10 
       glow-ani-border'>
                        Start Game
                    </button>
                    <button className=' bg-[#363040]/60 
       py-8 px-6 rounded-2xl text-7xl text-slate-400 glow-ani-border'>
                        <Link to='/Story'
                            onClick={() => { sfx.playClickSfx() }}
                            className='story-link'>
                            Story
                        </Link>
                    </button>
                    <button onClick={() => { handleCreditsClick(); sfx.playClickSfx(); }} className='bg-[#363040]/60 
       py-8 px-6 rounded-2xl text-7xl text-slate-400 glow-ani-border'>
                        Credits
                    </button>
                </div>
                {isCreditsShown &&
                    <section className='flex flex-row m-auto items-center 
           bg-[#363040]/60 py-8 px-4 glow-ani-border rounded-2xl 
          text-xl ml-8'>
                        <strong className='space-y-6 flex flex-col text-white'>
                            <cite>Programmer: Benjamin Donahue</cite>
                            <cite>Designer: Benjamin Donahue</cite>
                            <cite>Music: Benjamin Donahue</cite>
                            <cite>Images: Midjourney AI (At least until I can afford an artist)</cite>
                            <cite>Volume on symbol: Pixel Perfect</cite>
                            <cite>Volume off symbol: Google</cite>
                            <cite>SFX: <a href='https://opengameart.org/'>
                                OpenGameArt.Org
                            </a>
                            </cite>
                        </strong>
                    </section>
                }
            </section>

        </main>
    );
};

export default StartMenu;