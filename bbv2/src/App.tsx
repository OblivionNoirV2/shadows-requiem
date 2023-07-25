import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import SnowAnimation from './SnowAnimation';
//battle theme
import ti from './assets/sound/ost/Twilight Imperium.wav';
//title theme
import tt from './assets/sound/ost/Forboding.wav';
import wind from './assets/sound/sfx/Wind.mp3';
import wind2 from './assets/sound/sfx/wind2.wav';
import UpdateStats from './StatManagement';
import StartMenu from './StartMenu';
import MainPage from './MainPage';
import * as sm from './StatManagement';
import Story from './Story';
import EncyclopediaPage from './EnPage';
import { Randomizer } from './PlayerActions';
import { NameCharacters } from './Naming';
import YouDied from './YouDied';

//environmental sfx
const windSfx = new Audio(wind);
const windSfx2 = new Audio(wind2);

//Putting these in one function causes browser bugs for some reason
//Makes things freeze up
function scheduleWindSfx() {
  const interval = Randomizer(15000, 25000);
  setTimeout(() => {
    windSfx.play();
    windSfx.volume = 0.5;
    scheduleWindSfx();
  }, interval);
};

function scheduleWindSfx2() {
  const interval = Randomizer(10000, 15000);
  setTimeout(() => {
    windSfx2.play();
    windSfx2.volume = 0.5;
    scheduleWindSfx2();
  }, interval);
};


scheduleWindSfx();
scheduleWindSfx2();

const App: React.FC = () => {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [battleOst, setBattleOst] = useState(new Audio(ti));
  const [titleOst, setTitleOst] = useState(new Audio(tt));
  const [currentTrack, setCurrentTrack] = useState("title");
  const [isSnowOn, setIsSnowOn] = useState(true);


  const VolButton: React.FC = () => {
    return (
      <>
        <button onClick={HandleMusicOnOff}>
          {isMusicOn ? <img
            src={require('./assets/images/icons/volume-on.png')}
            alt='music on'
            className='w-10 vol-icon ml-4'></img> :
            <img src={require('./assets/images/icons/volume-off.png')}
              alt='music off'
              className='w-10 vol-icon ml-4'></img>
          }
        </button>
      </>
    )
  }

  const SnowOnOff: React.FC = () => {

    return (
      <section className='snow-switch-container'>

        <h4 className='text-slate-300 font-bold mb-8'>Snow</h4>


        <label className="snow-switch">


          <input type="checkbox" id="snow-switch" checked={isSnowOn}
            onChange={() => { setIsSnowOn(!isSnowOn) }
            } />
          <span className="slider round"></span>
        </label>
      </section>
    );
  };

  function TrackControls(current_track: HTMLAudioElement, prev_track: HTMLAudioElement) {
    prev_track.pause();
    prev_track.currentTime = 0;
    current_track.play();
    current_track.loop = true;
  }
  useEffect(() => {
    if (isMusicOn) {
      if (currentTrack === "battle") {
        TrackControls(battleOst, titleOst);
      } else if (currentTrack === "title") {
        TrackControls(titleOst, battleOst);
      }
    } else {
      battleOst.pause();
      titleOst.pause();
    }
  }, [isMusicOn, currentTrack]);

  function HandleMusicOnOff(): void {
    setIsMusicOn(!isMusicOn);
  }
  //start with false state, to render the start menu
  const [isGameStarted, setIsGameStarted] = useState(false);



  const navigate = useNavigate();

  function startGame() {
    setIsGameStarted(true);
    setCurrentTrack("battle");
    navigate('/Game');
  }
  function HandleBackToTitle() {
    setIsGameStarted(!isGameStarted);
    setCurrentTrack("title");
    navigate('/');
  }

  /*At program start, the ternary returns false 
  and renders the start menu. Trigger the callback when clicked,
  which flips the state to true, and renders the main page*/
  return (

    <>

      <Routes>
        <Route path='/' element={<StartMenu on_start={startGame} />} />
        <Route path='/Game' element={<MainPage onBackToTitle={HandleBackToTitle} />} />
        <Route path='/StartMenu' element={<StartMenu on_start={startGame} />} />
        <Route path='/Story' element={<Story />} />
        <Route path='/Encyclopedia' element={<EncyclopediaPage />} />
        <Route path='/NameCharacters' element={<NameCharacters />} />
        <Route path='YouDied' element={<YouDied />} />
      </Routes>
      <VolButton />
      {
        isSnowOn && <SnowAnimation />
      }
      <SnowOnOff />


    </>

  );
};



export default App;
