import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import SnowAnimation from './SnowAnimation';
//battle theme
import ti from './assets/sound/ost/Twilight Imperium.wav';
//title theme
import tt from './assets/sound/ost/Forboding.wav';
import UpdateStats from './StatManagement';
import StartMenu from './StartMenu';
import MainPage from './MainPage';
import Leaderboard from './Leaderboard';
import History from './History';
import CreateAccount from './AccountCreation';
//Page will need to completely re-render, so use a hook to flip it

//this prop just acts as a blank trigger


//contains the boss image and the health bar 
//will use ternaries to determine stage 

//maybe lock the hp bar in


const App: React.FC = () => {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [battleOst, setBattleOst] = useState(new Audio(ti));
  const [titleOst, setTitleOst] = useState(new Audio(tt));
  const [currentTrack, setCurrentTrack] = useState("title");

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
  const is_mobile = window.innerWidth <= 768;

  useEffect(() => {
    //flip the css class to change the bg
    {
      isGameStarted ? document.body.classList.add("new-bg") :
        document.body.classList.remove("new-bg")
    }

  }, [isGameStarted]);

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
      <audio>
        <source src='./assets/sound/ost/Twilight Imperium.wav'
          type='audio/wav' />
      </audio>
      <audio>
        <source src='./assets/sound/ost/Forboding.wav' />
      </audio>
      <audio>
        <source src='./assets/sound/sfx/selectclick.wav' />
      </audio>
      <Routes>
        <Route path='/' element={<StartMenu on_start={startGame} />} />
        <Route path='/Game' element={<MainPage onBackToTitle={HandleBackToTitle} />} />
        <Route path='/Leaderboard' element={<Leaderboard />} />
        <Route path='/History' element={<History />} />
        <Route path='/AccountCreation' element={<CreateAccount />} />
      </Routes>
      <VolButton />
      <SnowAnimation />
      <main>
        {is_mobile && (
          <>
            <h1 className='flex m-auto justify-center text-white 
            text-4xl'>
              Sorry, this game isn't meant for mobile devices
            </h1>
          </>
        )}
      </main>
    </>
  );
};



export default App;

